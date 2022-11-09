import ValidatorResult from '../ValidatorResult'
import { TypeOptions, Type, INVALID } from '../typings'

export type Options = TypeOptions<boolean>

function boolean(options: Options = {}): Type<boolean> {
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

export default boolean