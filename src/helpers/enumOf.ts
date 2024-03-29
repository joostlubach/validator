import { EnumTypeOf, EnumUtil, EnumValue } from 'ytil'

import { string, StringOptions } from '../types/index.js'
import { TypeFn } from '../typings.js'

export type EnumOptions<E extends EnumTypeOf<string>> = Omit<StringOptions<EnumValue<E>>, 'enum'>

export function enumOf<E extends EnumTypeOf<string>>(Enum: E, defaultOptions: EnumOptions<any> = {}): TypeFn<EnumValue<E>, EnumOptions<E>> {
  return (options = {}) => string<EnumValue<E>>({
    enum: EnumUtil.values(Enum),
    ...defaultOptions,
    ...options,
  }) as any
}
