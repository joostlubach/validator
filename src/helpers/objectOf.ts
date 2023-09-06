import object, { MonomorphicOptions } from '../types/object'
import { ObjectSchema, SchemaInstance, TypeCreator, TypeOptions } from '../typings'

export default function objectOf<T>(schema: ObjectSchema, defaults?: TypeOptions<T>): TypeCreator<T>
export default function objectOf<S extends ObjectSchema>(schema: S, defaults?: MonomorphicOptions<S>): TypeCreator<SchemaInstance<S>>
export default function objectOf(schema: ObjectSchema, defaults: TypeOptions<any> = {}) {
  return (options = {}) => object<any>({
    schema,
    ...defaults,
    ...options
  })
}