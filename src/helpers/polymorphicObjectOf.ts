import { object } from '../types'
import {
  ObjectSchema,
  ObjectSchemaMap,
  PolySchemaInstance,
  TypeCreator,
  TypeOptions,
} from '../typings'

export function polymorphicObjectOf<T>(schemas: Record<string, ObjectSchema>, defaults?: TypeOptions<T>): TypeCreator<T>
export function polymorphicObjectOf<SM extends ObjectSchemaMap>(schemas: SM, defaults?: TypeOptions<PolySchemaInstance<SM>>): TypeCreator<PolySchemaInstance<SM>>
export function polymorphicObjectOf(schemas: Record<string, ObjectSchema>, defaults?: TypeOptions<any>): TypeCreator<any> {
  return (options = {}) => object({
    polymorphic: true,
    schemas,
    ...defaults,
    ...options,
  })
}