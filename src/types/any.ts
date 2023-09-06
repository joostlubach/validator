import { Type, TypeOptions } from '../typings'

export type AnyOptions = TypeOptions<any>

export default function any(options: AnyOptions = {}): Type<any> {
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