import { array, ArrayOptions } from '../types'
import { Type, TypeFn } from '../typings'

export type ArrayOfOptions<T> = Omit<ArrayOptions<T>, 'itemType'>

export function arrayOf<T>(itemType: Type<T, ArrayOfOptions<T>>, defaults?: ArrayOfOptions<T>): TypeFn<T[], ArrayOfOptions<T>>
export function arrayOf(itemType: Type<any, any>, defaults?: ArrayOfOptions<any>): TypeFn<any, ArrayOfOptions<any>> {
  return (options = {}) => array({itemType, ...defaults, ...options})
}