import { dictionary } from '../types'
import { DictionaryOptions } from '../types/dictionary'
import { Type, TypeFn } from '../typings'

export function dictionaryOf<T>(valueType: Type<T>, defaults?: Omit<DictionaryOptions<T>, 'valueType'>): TypeFn<Record<string, T>, Omit<DictionaryOptions<T>, 'valueType'>>
export function dictionaryOf(valueType: Type<any>, defaults: Omit<DictionaryOptions<any>, 'valueType'> = {}): TypeFn<any, Omit<DictionaryOptions<any>, 'valueType'>> {
  return (options = {}) => dictionary({
    valueType,
    ...defaults,
    ...options
  })
}