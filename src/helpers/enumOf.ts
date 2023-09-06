import { AnyEnumType, EnumUtil } from 'ytil'
import { string, StringOptions } from '../types'
import { TypeCreator } from '../typings'

export default function enumOf<E extends string & AnyEnumType>(Enum: E, defaultOptions: StringOptions<E> = {}): TypeCreator<E> {
  return (options = {}) => string<E>({
    enum: EnumUtil.values(Enum),
    ...defaultOptions,
    ...options,
  })
}