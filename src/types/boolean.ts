import ValidationContext from '../ValidationContext'
import {TypeOptions, Type, INVALID} from '../typings'

export interface Options {}

function boolean(options?: TypeOptions<boolean> & Options & {required: false}): Type<boolean> & {options: {required: false}}
function boolean(options?: TypeOptions<boolean> & Options & {required?: true}): Type<boolean> & {options: {required: true}}
function boolean(options: TypeOptions<boolean> = {}): Type<boolean> {
  return {
    options,

    cast(value: any): boolean | INVALID {
      return !!value
    },

    serialize(value: boolean) {
      return value
    },

    validate(value: any, context: ValidationContext) {
      if (typeof value !== 'boolean') {
        context.addError('invalid_type', 'Expected a boolean')
      }
    }
  }
}

export default boolean