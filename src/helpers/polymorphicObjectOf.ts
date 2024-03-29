import { PolymorphicOptions } from '../types/index.js'
import object from '../types/object.js'
import { ObjectSchemaMap, PolySchemaInstance, TypeFn, TypeOptions } from '../typings.js'

export function polymorphicObjectOf<T>(schema: ObjectSchemaMap, defaults?: TypeOptions<T>): TypeFn<T, TypeOptions<T>>
export function polymorphicObjectOf<SM extends ObjectSchemaMap>(schemas: SM, defaults?: Omit<PolymorphicOptions<SM>, 'polymorphic' | 'schemas'>): TypeFn<PolySchemaInstance<SM>, Omit<PolymorphicOptions<SM>, 'polymorphic' | 'schemas'>>
export function polymorphicObjectOf(schemas: ObjectSchemaMap, defaults: TypeOptions<any> = {}) {
  return (options = {}) => object<any>({
    polymorphic: true,
    schemas,
    ...defaults,
    ...options,
  })
}
