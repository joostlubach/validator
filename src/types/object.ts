import ValidatorResult from '../ValidatorResult'
import { Type, TypeOptions, ObjectSchema, SchemaInstance, AnyObject, ObjectSchemaMap, INVALID, COERCE, TraverseCallback, isSetResult } from '../typings'
import { isFunction, isObject, isPlainObject } from 'lodash'

export type Options = TypeOptions<AnyObject> & (
  | SchemalessOptions
  | MonomorphicOptions<any>
  | PolymorphicOptions<any>
)

interface SchemalessOptions {}
interface MonomorphicOptions<S extends ObjectSchema> {
  polymorphic?: false
  schema?:      S
}
interface PolymorphicOptions<S extends ObjectSchemaMap> {
  polymorphic: true
  schemas:     S
}

export default function object(options: Options = {}): Type<AnyObject> {
  const isPolymorphic      = 'polymorphic' in options && !!options.polymorphic
  const monomorphicOptions = options as MonomorphicOptions<any>
  const polymorphicOptions = options as PolymorphicOptions<any>

  function getObjectSchema(value: AnyObject | null): ObjectSchema | null {
    if (value == null) { return null }

    if (isPolymorphic) {
      return polymorphicOptions.schemas[value.type] ?? null
    } else {
      return monomorphicOptions.schema ?? null
    }
  }

  return {
    name: 'object',
    options,

    coerce(value: any, result: ValidatorResult<any>, partial: boolean): SchemaInstance<any> | INVALID {
      if (value != null && !isPlainObject(value) && isFunction(value[COERCE])) {
        value = value[COERCE](this)
      }
      if (options.coerce != null) {
        value = options.coerce(value)
      }
      if (!isObject(value)) { return INVALID }

      const schema = getObjectSchema(value)
      if (schema == null) { return value as SchemaInstance<any> }

      const coerced: any = {}

      if (isPolymorphic) {
        coerced.type = (value as any).type
      }

      const remaining: AnyObject = {...value}
      let restType: Type<any> | undefined

      for (const name of schemaKeys(schema)) {
        if (name === '__rest') {
          restType = schema[name]
          continue
        }

        const type = schema[name]

        // If the value is `undefined`, skip this one altogether if requested.
        if (partial && remaining[name] === undefined) {
          continue
        }

        delete remaining[name]

        const withDefaults: AnyObject = {...value}

        // Check for a default.
        if (withDefaults[name] == null && type.options.default != null) {
          withDefaults[name] = isFunction(type.options.default)
            ? type.options.default.call(null)
            : type.options.default
        }

        // Ask the type to coerce the value.
        coerced[name] = withDefaults[name] != null
          ? type.coerce(withDefaults[name], result, partial)
          : null
      }

      // Assign any rest values.
      if (restType != null) {
        for (const [name, value] of Object.entries(remaining)) {
          coerced[name] = value != null
            ? restType.coerce(value, result, partial)
            : null
        }
      }

      return coerced
    },

    serialize(value: AnyObject): AnyObject {
      const schema = getObjectSchema(value)
      if (schema == null) { return value }

      const result: AnyObject = {}
      if (isPolymorphic) {
        result.type = value.type
      }

      const names = new Set(Object.keys(value))

      for (const [name, type] of Object.entries(schema)) {
        if (name === '__rest') { continue }

        if (value[name] !== undefined) {
          result[name] = value[name] == null
            ? null
            : type.serialize(value[name], value)
        }
        names.delete(name)
      }

      if (schema.__rest != null && names.size > 0) {
        for (const name of names) {
          if (value[name] === undefined) {
            continue
          } else if (value[name] === null) {
            result[name] = null
          } else {
            result[name] = schema.__rest.serialize(value[name])
          }
        }
      }

      return result
    },

    traverse(value: AnyObject, path: string[], callback: TraverseCallback) {
      if (!isObject(value)) { return }

      for (const [propName, propValue] of Object.entries(value)) {
        const propPath = [...path, propName]

        const schema = getObjectSchema(value)
        const type   = schema?.[propName]
        if (type == null) { continue }

        const retval = callback(propValue, propPath.join('.'), type)
        if (retval === false) { return }

        if (isSetResult(retval)) {
          (value as any)[propName] = retval.set
        }

        type.traverse?.(propValue, propPath, callback)
      }
    },

    async validate(value: any, result: ValidatorResult<any>): Promise<void> {
      if (!isObject(value)) {
        result.addError('invalid_type', 'Expected an object')
        return
      }

      const schema = getObjectSchema(value)
      if (isPolymorphic && schema == null) {
        const message = (value as any).type == null ? "This value is required" : "Unknown type"
        result.for('type').addError('unknown_type', message)
        return
      }

      if (schema != null) {
        await validateObjectSchema(value, schema, result)
      }
    },

  }
}

async function validateObjectSchema<S extends ObjectSchema>(
  value:   AnyObject,
  schema:  S,
  result: ValidatorResult<any>
): Promise<void> {
  checkMissing(value, schema, result)

  // Check the types
  for (const name of Object.keys(value)) {
    let type = schema[name]
    if (type == null && schema.__rest != null) {
      type = schema.__rest
    }
    if (type == null) { continue }

    await result.validator.validateType(value[name], type, result.for(name))
  }
}

function checkMissing<S extends ObjectSchema>(
  attributes: AnyObject,
  schema:     S,
  context:    ValidatorResult<any>
) {
  for (const name of schemaKeys(schema)) {
    if (name === '__rest') { continue }

    const type = schema[name]
    if (type.options.required === false || type.options.default != null) { continue }
    if (name in attributes) { continue }

    context.for(name).addError('required', `This value is required`)
  }
}

function schemaKeys(schema: ObjectSchema) {
  return Object.keys(schema)
}