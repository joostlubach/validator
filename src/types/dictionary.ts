import { any } from '../types'
import { Type, TypeOptions } from '../typings'
import object, { REST_MARKER } from './object'

export interface DictionaryOptions<T> extends TypeOptions<Record<string, T>> {
  valueType?: Type<T>
}

export default function dictionary<T>(options: DictionaryOptions<T> & {required: false}): Type<Record<string, T> | null>
export default function dictionary<T>(options: DictionaryOptions<T>): Type<Record<string, T>>
export default function dictionary(options: DictionaryOptions<any>): Type<any> {
  const {
    valueType = any({required: false}),
    ...rest
  } = options

  return object({
    schema: {
      [REST_MARKER]: valueType,
    },
    ...rest,
  })
}