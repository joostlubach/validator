import { ObjectSchema, TypeOptions, Type } from '../typings'
import { object } from '../types'

type PolymorphicObjectTypeCreator<T> =
  (options?: TypeOptions<AnyObject & {type: T}> & {extra?: ObjectSchema}) => Type<AnyObject & {type: T}>

export default function polymorphicObjectOf<T extends string>(schemas: Record<T, ObjectSchema>): PolymorphicObjectTypeCreator<T> {
  return (options = {}) => object({
    polymorphic: true,
    schemas:     Object.entries(schemas).reduce((acc, [type, schema]) => ({...acc, [type]: {...schema, ...options.extra}}), {}),
    ...options as any,
  }) as any
}