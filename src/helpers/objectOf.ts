import {ObjectSchema, TypeOptions, Type, SchemaInstance} from '../typings'
import {object} from '../types'

type ObjectTypeCreator<S extends ObjectSchema> =
  (options?: TypeOptions<SchemaInstance<S>>) => Type<SchemaInstance<S>>

export default function objectOf<S extends ObjectSchema>(schema: S): ObjectTypeCreator<S> {
  return (options = {}) => object({schema, ...options as any}) as any
}