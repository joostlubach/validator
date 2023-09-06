import { INVALID, Type, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export type BooleanOptions = TypeOptions<boolean>

export default function boolean(options: BooleanOptions = {}): Type<boolean> {
  return {
    name: 'boolean',
    options,

    coerce(value: any): boolean | INVALID {
      return !!value
    },

    serialize(value: boolean) {
      return value
    },

    validate(value: any, result: ValidatorResult<any>) {
      if (typeof value !== 'boolean') {
        result.addError('invalid_type', 'Expected a boolean')
      }
    },
  }
}