import { isFunction, isObject, isPlainObject } from 'lodash'
import {
  COERCE,
  CustomCoerce,
  INVALID,
  isSetResult,
  ObjectSchema,
  ObjectSchemaMap,
  SchemaInstance,
  TraverseCallback,
  Type,
  TypeOptions,
} from '../typings'
import ValidatorResult from '../ValidatorResult'

export type Options = TypeOptions<Record<string, any>> & (
  | SchemalessOptions
  | MonomorphicOptions<any>
  | PolymorphicOptions<any>
)

interface SchemalessOptions {}
interface MonomorphicOptions<S extends ObjectSchema> {
  polymorphic?: false
  schema?:      S
  coerce?:      CustomCoerce<Record<string, any>>
}
interface PolymorphicOptions<S extends ObjectSchemaMap> {
  polymorphic: true
  schemas:     S
  coerce?:     CustomCoerce<Record<string, any>>
}

export default function object(options: Options = {}): Type<Record<string, any>> {
  const isPolymorphic      = 'polymorphic' in options && !!options.polymorphic
  const monomorphicOptions = options as MonomorphicOptions<any>
  const polymorphicOptions = options as PolymorphicOptions<any>

  function getObjectSchema(value: Record<string, any> | null): ObjectSchema | null {
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

      const remaining: Record<string, any> = {...value}
      let restType: Type<any> | undefined

      for (const name of schemaKeys(schema)) {
        if (name === REST_MARKER) {
          restType = schema[name]
          continue
        }

        const type = schema[name]

        // If the value is `undefined`, skip this one altogether if requested.
        if (partial && remaining[name] === undefined) {
          continue
        }

        delete remaining[name]

        const withDefaults: Record<string, any> = {...value}

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

    serialize(value: Record<string, any>): Record<string, any> {
      const schema = getObjectSchema(value)
      if (schema == null) { return value }

      const result: Record<string, any> = {}
      if (isPolymorphic) {
        result.type = value.type
      }

      const names = new Set(Object.keys(value))

      for (const [name, type] of Object.entries(schema)) {
        if (name === REST_MARKER) { continue }

        if (value[name] !== undefined) {
          result[name] = value[name] == null
            ? null
            : type.serialize(value[name], value)
        }
        names.delete(name)
      }

      if (schema[REST_MARKER] != null && names.size > 0) {
        for (const name of names) {
          if (value[name] === undefined) {
            continue
          } else if (value[name] === null) {
            result[name] = null
          } else {
            result[name] = schema[REST_MARKER].serialize(value[name])
          }
        }
      }

      return result
    },

    traverse(value: Record<string, any>, path: string[], callback: TraverseCallback) {
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

    validate(value: any, result: ValidatorResult<any>) {
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
        validateObjectSchema(value, schema, result)
      }
    },

  }
}

function validateObjectSchema<S extends ObjectSchema>(
  value:   Record<string, any>,
  schema:  S,
  result: ValidatorResult<any>
): void {
  checkMissing(value, schema, result)

  // Check the types
  for (const name of Object.keys(value)) {
    let type = schema[name]
    if (type == null && schema[REST_MARKER] != null) {
      type = schema[REST_MARKER]
    }
    if (type == null) { continue }

    result.validator.validateType(value[name], type, result.for(name))
  }
}

function checkMissing<S extends ObjectSchema>(
  attributes: Record<string, any>,
  schema:     S,
  context:    ValidatorResult<any>
) {
  for (const name of schemaKeys(schema)) {
    if (name === REST_MARKER) { continue }

    const type = schema[name]
    if (type.options.required === false || type.options.default != null) { continue }
    if (name in attributes) { continue }

    context.for(name).addError('required', `This value is required`)
  }
}

function schemaKeys(schema: ObjectSchema) {
  return Object.keys(schema)
}

export const REST_MARKER = '...'