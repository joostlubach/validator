import { TypeOptions, Type } from '../typings'

export type Options = TypeOptions<any>

function any(options: Options = {}): Type<any> {
  return {
    name: 'any',
    options,

    coerce(value: any) {
      return value
    },

    serialize(value: any) {
      return value
    },
  }
}

export default any