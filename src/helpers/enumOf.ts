import { AnyEnumType, EnumUtil } from 'ytil'
import { string, StringOptions } from '../types'
import { TypeCreator } from '../typings'

export type EnumOptions<E extends string & AnyEnumType> = StringOptions<E>

export function enumOf<E extends string & AnyEnumType>(Enum: E, defaultOptions?: EnumOptions<E>): TypeCreator<E, EnumOptions<E>>
export function enumOf(Enum: AnyEnumType, defaultOptions: EnumOptions<any> = {}): TypeCreator<AnyEnumType, EnumOptions<any>> {
  return (options = {}) => string({
    enum: EnumUtil.values(Enum),
    ...defaultOptions,
    ...options,
  })
}