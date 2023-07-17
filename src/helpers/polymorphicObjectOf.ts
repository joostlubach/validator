import { object } from '../types'
import { ObjectSchema, Type, TypeOptions } from '../typings'

type PolymorphicObjectTypeCreator<T> =
  (options?: TypeOptions<Record<string, any> & {type: T}> & {extra?: ObjectSchema}) => Type<Record<string, any> & {type: T}>

export default function polymorphicObjectOf<T extends string>(schemas: Record<T, ObjectSchema>): PolymorphicObjectTypeCreator<T> {
  return (options = {}) => object({
    polymorphic: true,
    schemas: Object.entries<ObjectSchema>(schemas).reduce((acc, [type, schema]) => ({
      ...acc,
      [type]: {...schema, ...options.extra}
    }), {}),
    ...options as any,
  }) as any
}