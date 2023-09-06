import { array, ArrayOptions } from '../types'
import { Type, TypeCreator } from '../typings'

export default function arrayOf<T>(itemType: Type<T>, defaults?: ArrayOptions<T>): TypeCreator<T[]> {
  return (options = {}) => array({itemType, ...defaults, ...options})
}