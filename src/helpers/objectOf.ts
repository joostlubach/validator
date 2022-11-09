import { ObjectSchema, TypeOptions, Type, SchemaInstance } from '../typings'
import { object, ObjectOptions } from '../types'

type ObjectTypeCreator<S extends ObjectSchema> =
  (options?: TypeOptions<SchemaInstance<S>>) => Type<SchemaInstance<S>>

export default function objectOf<S extends ObjectSchema>(schema: S, defaultOptions: ObjectOptions = {}): ObjectTypeCreator<S> {
  return (options = {}) => object({schema, ...defaultOptions, ...options as any}) as any
}