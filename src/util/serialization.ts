import { ObjectSchema, Type } from 'validator'
import { mapValues, isFunction } from 'lodash'
import { ResourceRegistry } from 'json-api'

export function serializeObjectSchema(registry: ResourceRegistry, schema: ObjectSchema) {
  return mapValues(schema, type => serializeType(registry, type))
}

export function serializeType(registry: ResourceRegistry, type: Type<any>) {
  const serialized: AnyObject = {
    type:     type.options.type ?? type.name,
    required: true,

    ...type.options,
    default:  isFunction(type.options.default) ? type.options.default() : type.options.default,
  }

  if (type.name === 'ref') {
    serialized.resourceType = registry.findResourceForModel(serialized.model)?.type
    delete serialized.model
  }

  if (type.name === 'object') {
    serialized.schema = serializeObjectSchema(registry, serialized.schema)
  }
  if (type.name === 'array') {
    serialized.itemType = serializeType(registry, serialized.itemType)
  }
  if (type.name === 'record') {
    serialized.valueType = serializeType(registry, serialized.valueType)
  }

  return serialized
}