import ValidationContext from '../ValidationContext'
import {Type, TypeOptions, ObjectSchema, SchemaInstance, AnyObject, ObjectSchemaMap, PolySchemaInstance, OptionalType, RequiredType, INVALID} from '../typings'
import {isPlainObject} from 'lodash'

export type Options = SchemalessOptions | MonomorphicOptions<any> | PolymorphicOptions<any>

interface SchemalessOptions {}
interface MonomorphicOptions<S extends ObjectSchema> {
  polymorphic?: false
  schema?:      S
}
interface PolymorphicOptions<S extends ObjectSchemaMap> {
  polymorphic: true
  schemas:     S
}

function object(
  options?: TypeOptions<AnyObject> & SchemalessOptions & {required: false}
): OptionalType<AnyObject>
function object(
  options?: TypeOptions<AnyObject> & SchemalessOptions & {required?: true}
): RequiredType<AnyObject>
function object<S extends ObjectSchema>(
  options?: TypeOptions<SchemaInstance<S>> & MonomorphicOptions<S> & {required: false, schema: S}
): OptionalType<SchemaInstance<S>>
function object<S extends ObjectSchema>(
  options?: TypeOptions<SchemaInstance<S>> & MonomorphicOptions<S> & {required?: true, schema: S}
): RequiredType<SchemaInstance<S>>
function object<S extends ObjectSchemaMap>(
  options?: TypeOptions<PolySchemaInstance<S>> & PolymorphicOptions<S> & {required: false, schemas: S}
): OptionalType<PolySchemaInstance<S>>
function object<S extends ObjectSchemaMap>(
  options?: TypeOptions<PolySchemaInstance<S>> & PolymorphicOptions<S> & {required?: true, schemas: S}
): RequiredType<PolySchemaInstance<S>>

function object(options: TypeOptions<any> & Options = {}): Type<any> {
  function getObjectSchema(value: AnyObject | null): ObjectSchema | null {
    if (value == null) { return null }

    if (options.polymorphic) {
      return options.schemas[value.type] || null
    } else {
      return options.schema || null
    }
  }

  return {
    options,

    cast(value: any, context: ValidationContext, partial: boolean): SchemaInstance<any> | INVALID {
      if (!isPlainObject(value)) { return INVALID }

      const schema = getObjectSchema(value)
      if (schema == null) { return value }

      const result: any = {}

      if (options.polymorphic) {
        result.type = value.type
      }

      for (const name of Object.keys(schema)) {
        const type = schema[name]

        // If the value is `undefined`, skip this one altogether if requested.
        if (partial && value[name] === undefined) {
          continue
        }

        // Check for a default.
        if (value[name] == null && type.options.default != null) {
          result[name] = type.options.default
          continue
        }

        // Ask the type to cast the value.
        result[name] = value[name] != null
          ? type.cast(value[name], context, partial)
          : null
      }

      return result
    },

    serialize(value: SchemaInstance<any>): any {
      const schema = getObjectSchema(value)
      if (schema == null) { return value }

      const result: AnyObject = {}
      if (options.polymorphic) {
        result.type = value.type
      }

      for (const name of Object.keys(value)) {
        if (schema[name] == null) { continue }

        result[name] = value[name] != null
          ? schema[name].serialize(value[name])
          : null
      }
      return result
    },

    async validate(value: any, context: ValidationContext): Promise<void> {
      if (!isPlainObject(value)) {
        context.addError('invalid_type', 'Expected an object')
        return
      }

      const schema = getObjectSchema(value)
      if (options.polymorphic && schema == null) {
        context.for('type').addError('unknown_type', `Unknown type`)
        return
      }

      if (schema != null) {
        await validateObjectSchema(value, schema, context)
      }
    }

  }
}

async function validateObjectSchema<S extends ObjectSchema>(
  value:   AnyObject,
  schema:  S,
  context: ValidationContext
): Promise<void> {
  checkMissing(value, schema, context)

  // Check the types
  for (const name of Object.keys(value)) {
    let type = schema[name]
    if (type == null && schema._extra != null) {
      type = schema._extra
    }
    if (type == null) { continue }

    value[name] = await context.validator.validateType(value[name], type, context.for(name))
  }
}

function checkMissing<S extends ObjectSchema>(
  attributes: AnyObject,
  schema:     S,
  context:    ValidationContext
) {
  for (const name of Object.keys(schema)) {
    const type = schema[name]
    if (type.options.required === false || type.options.default != null) { continue }
    if (name in attributes) { continue }

    context.for(name).addError('required', `This value is required`)
  }
}

export default object