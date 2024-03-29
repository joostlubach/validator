import { dictionary, DictionaryOptions } from '../types/index.js'
import { Type, TypeFn } from '../typings.js'

export type DictionaryOfOptions<T> = Omit<DictionaryOptions<T>, 'valueType'>

export function dictionaryOf<T>(valueType: Type<T, DictionaryOfOptions<T>>, defaults?: DictionaryOfOptions<T>): TypeFn<Record<string, T>, DictionaryOfOptions<T>>
export function dictionaryOf(valueType: Type<any, DictionaryOfOptions<any>>, defaults: DictionaryOfOptions<any> = {}): TypeFn<any, DictionaryOfOptions<any>> {
  return (options = {}) => dictionary({
    valueType,
    ...defaults,
    ...options,
  })
}
