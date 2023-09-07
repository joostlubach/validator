import object, { MonomorphicOptions } from '../types/object'
import { ObjectSchema, SchemaInstance, TypeCreator, TypeOptions } from '../typings'

export function objectOf<T>(schema: ObjectSchema, defaults?: TypeOptions<T>): TypeCreator<T>
export function objectOf<S extends ObjectSchema>(schema: S, defaults?: MonomorphicOptions<S>): TypeCreator<SchemaInstance<S>>
export function objectOf(schema: ObjectSchema, defaults: TypeOptions<any> = {}) {
  return (options = {}) => object<any>({
    schema,
    ...defaults,
    ...options
  })
}