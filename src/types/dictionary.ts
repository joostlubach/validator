import { any } from 'validator/types'
import { Type, TypeOptions } from '../typings'
import object, { REST_MARKER } from './object'

export interface Options extends TypeOptions<Record<string, any>> {
  valueType?: Type<any>
}

function dictionary(options: Options): Type<any> {
  const {
    valueType = any({required: false}),
    ...rest
  } = options
  return object({
    schema: {
      [REST_MARKER]: valueType,
    },
    ...rest,
  } as any)
}

export default dictionary