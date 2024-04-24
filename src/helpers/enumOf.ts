import { EnumTypeOf, EnumUtil, EnumValue } from 'ytil'

import { string, StringOptions } from '../types'
import { TypeFn } from '../typings'

export type EnumOptions<E extends EnumTypeOf<string>> = Omit<StringOptions<EnumValue<E>>, 'enum'>

export function enumOf<E extends EnumTypeOf<string>>(Enum: E, defaultOptions: EnumOptions<E> = {}): TypeFn<EnumValue<E>, EnumOptions<E>> {
  return (options = {}) => string<EnumValue<E>, EnumOptions<E>>({
    enum: EnumUtil.values(Enum),
    ...defaultOptions,
    ...options,
  }) as any
}
