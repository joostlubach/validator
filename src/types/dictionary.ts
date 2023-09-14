import { any } from '../types'
import { OptionalType, RequiredType, Type, TypeOptions } from '../typings'
import object, { REST_MARKER } from './object'

export interface DictionaryOptions<T> extends TypeOptions<Record<string, T>> {
  valueType?: Type<T, any>
}

export default function dictionary<T>(options: DictionaryOptions<T> & {required: false}): OptionalType<Record<string, T>, DictionaryOptions<T>>
export default function dictionary<T>(options: DictionaryOptions<T>): RequiredType<Record<string, T>, DictionaryOptions<T>>
export default function dictionary(options: DictionaryOptions<any>): Type<any, any> {
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