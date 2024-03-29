import { isDate } from 'lodash'

import ValidatorResult from '../ValidatorResult.js'
import { INVALID, TypeOptions } from '../typings.js'
import { defineType } from '../util/index.js'

export interface DateOptions extends TypeOptions<Date> {
  after?:  Date
  before?: Date
}

/**
 * A simple type wrapping a JS Date object.
 */
const date = defineType<Date, DateOptions>('date', (options: DateOptions) => ({
  coerce: raw => {
    if (isDate(raw)) { return raw }

    if (typeof raw === 'number' || typeof raw === 'string') {
      return new Date(raw)
    } else {
      return INVALID
    }
  },

  serialize: value => {
    if (value instanceof Date) {
      return value.toISOString()
    } else {
      return 'invalid'
    }
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

  openAPI: {
    type:   'string',
    format: 'date-time',
  },
}))

export default date
