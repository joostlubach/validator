import ValidationContext from '../ValidationContext'
import {TypeOptions, Type, INVALID} from '../typings'
import {isDate} from 'lodash'

export interface Options {
  after?:  Date
  before?: Date
}

function date(options?: TypeOptions<Date> & Options & {required: false}): Type<Date> & {options: {required: false}}
function date(options?: TypeOptions<Date> & Options & {required?: true}): Type<Date> & {options: {required: true}}
function date(options: TypeOptions<Date> & Options = {}): Type<Date> {
  return {
    options,

    cast(value: any): Date | INVALID {
      if (isDate(value)) { return value }

      if (typeof value === 'number' || typeof value === 'string') {
        return new Date(value)
      } else {
        return INVALID
      }
    },

    serialize(value: Date) {
      return value
    },

    validate(value: any, context: ValidationContext) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        context.addError('invalid_type', 'Expected a date')
        return
      }

      if (options.after != null && value < options.after) {
        context.addError('date.too_early', `This value should be after ${options.after}`)
      }
      if (options.before != null && value > options.before) {
        context.addError('date.too_late', `This value should be before ${options.before}`)
      }
    }
  }
}

export default date