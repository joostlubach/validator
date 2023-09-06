import { object } from '../types'
import {
  ObjectSchema,
  ObjectSchemaMap,
  PolySchemaInstance,
  TypeCreator,
  TypeOptions,
} from '../typings'

export default function polymorphicObjectOf<T>(schemas: Record<string, ObjectSchema>, defaults?: TypeOptions<T>): TypeCreator<T>
export default function polymorphicObjectOf<SM extends ObjectSchemaMap>(schemas: SM, defaults?: TypeOptions<PolySchemaInstance<SM>>): TypeCreator<PolySchemaInstance<SM>>
export default function polymorphicObjectOf(schemas: Record<string, ObjectSchema>, defaults?: TypeOptions<any>): TypeCreator<any> {
  return (options = {}) => object({
    polymorphic: true,
    schemas,
    ...defaults,
    ...options,
  })
}