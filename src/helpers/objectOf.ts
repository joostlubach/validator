import { MonomorphicOptions } from '../types/index.js'
import object from '../types/object.js'
import { ObjectSchema, SchemaInstance, TypeFn, TypeOptions } from '../typings.js'

export function objectOf<S extends ObjectSchema>(schema: S): TypeFn<SchemaInstance<S>, MonomorphicOptions<S>>
export function objectOf<T>(schema: ObjectSchema, defaults?: TypeOptions<T>): TypeFn<T, TypeOptions<T>>
export function objectOf(schema: ObjectSchema, defaults: TypeOptions<any> = {}) {
  return (options = {}) => object<any>({
    schema,
    ...defaults,
    ...options,
  })
}
