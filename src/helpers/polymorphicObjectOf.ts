import object from '../types/object'
import { ObjectSchemaMap, PolySchemaInstance, TypeFn, TypeOptions } from '../typings'

export function polymorphicObjectOf<T>(schema: ObjectSchemaMap, defaults?: TypeOptions<T>): TypeFn<T, TypeOptions<T>>
export function polymorphicObjectOf<SM extends ObjectSchemaMap>(schemas: SM, defaults?: TypeOptions<PolySchemaInstance<SM>>): TypeFn<PolySchemaInstance<SM>, TypeOptions<PolySchemaInstance<SM>>>
export function polymorphicObjectOf(schemas: ObjectSchemaMap, defaults: TypeOptions<any> = {}): TypeFn<any, any> {
  return (options = {}) => object<any>({
    polymorphic: true,
    schemas,
    ...defaults,
    ...options,
  })
}
