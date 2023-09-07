import { isDate } from 'lodash'
import { defineType } from '../helpers'
import { INVALID, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export interface DateOptions extends TypeOptions<Date> {
  after?:  Date
  before?: Date
}

const date = defineType<Date, DateOptions>('date', (options: DateOptions) => ({
  coerce(value: any): Date | INVALID {
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

  validate(value: any, result: ValidatorResult<any>) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      result.addError('invalid_type', 'Expected a date')
      return
    }

    if (options.after != null && value < options.after) {
      result.addError('date.too_early', `This value should be after ${options.after}`)
    }
    if (options.before != null && value > options.before) {
      result.addError('date.too_late', `This value should be before ${options.before}`)
    }
  },
}))

export default date