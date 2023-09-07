import { array, ArrayOptions } from '../types'
import { Type, TypeFn } from '../typings'

export function arrayOf<T>(itemType: Type<T>, defaults?: Omit<ArrayOptions<T>, 'itemType'>): TypeFn<T[], Omit<ArrayOptions<T>, 'itemType'>>
export function arrayOf(itemType: Type<any>, defaults?: Omit<ArrayOptions<any>, 'itemType'>): TypeFn<any, Omit<ArrayOptions<any>, 'itemType'>> {
  return (options = {}) => array({itemType, ...defaults, ...options})
}