import { TypeOptions, Type } from '../typings'
import { array } from '../types'

type ArrayTypeCreator<T> =
  (options?: TypeOptions<T[]>) => Type<T[]>

export default function arrayOf<T>(itemType: Type<T>): ArrayTypeCreator<T> {
  return (options = {}) => array({itemType, ...options as any})
}