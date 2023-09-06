import { dictionary } from '../types'
import { Type, TypeCreator, TypeOptions } from '../typings'

export default function dictionaryOf<T>(valueType: Type<T>, defaults: TypeOptions<Record<string, T>>): TypeCreator<Record<string, T>> {
  return (options = {}) => dictionary<T>({valueType, ...defaults, ...options})
}