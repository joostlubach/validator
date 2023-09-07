import { AnyEnumType, EnumTypeOf, EnumUtil } from 'ytil'
import { string, StringOptions } from '../types'
import { TypeFn } from '../typings'

export type EnumOptions<E extends string> = StringOptions<E>

export function enumOf<E extends string>(Enum: EnumTypeOf<E>, defaultOptions?: EnumOptions<E>): TypeFn<E, EnumOptions<E>>
export function enumOf(Enum: AnyEnumType, defaultOptions: EnumOptions<any> = {}): TypeFn<AnyEnumType, EnumOptions<any>> {
  return (options = {}) => string({
    enum: EnumUtil.values(Enum),
    ...defaultOptions,
    ...options,
  })
}