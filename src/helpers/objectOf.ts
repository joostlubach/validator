import object, { MonomorphicOptions } from '../types/object'
import { ObjectSchema, SchemaInstance, Type, TypeFn, TypeOptions } from '../typings'

export function objectOf<S extends ObjectSchema>(schema: S): TypeFn<SchemaInstance<S>, MonomorphicOptions<S>>
export function objectOf<T>(schema: ObjectSchema, defaults?: TypeOptions<T>): TypeFn<T, TypeOptions<T>>
export function objectOf(schema: ObjectSchema, defaults: TypeOptions<any> = {}) {
  return (options = {}) => object<any>({
    schema,
    ...defaults,
    ...options,
  })
}
