import { isDate } from 'lodash'

import { INVALID, TypeOptions } from '../typings'
import { defineType } from '../util'
import ValidatorResult from '../ValidatorResult'

export interface DateOptions extends TypeOptions<Date> {
  after?:  Date
  before?: Date
}

const date = defineType<Date, DateOptions>('date', (options: DateOptions) => ({
  coerce: raw => {
    if (isDate(raw)) { return raw }

    if (typeof raw === 'number' || typeof raw === 'string') {
      return new Date(raw)
    } else {
      return INVALID
    }
  },

  serialize: value => value,

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
