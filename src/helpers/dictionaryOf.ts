import { dictionary } from '../types'
import { DictionaryOptions } from '../types/dictionary'
import { Type, TypeCreator, TypeOptions } from '../typings'

export function dictionaryOf(valueType: Type<any>, defaults: DictionaryOptions<any> = {}): TypeCreator<Record<string, any> | null> {
  return (options = {}) => dictionary({
    valueType,
    ...defaults,
    ...options
  })
}