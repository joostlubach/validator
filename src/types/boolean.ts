import { defineType } from '../helpers'
import { TypeOptions } from '../typings'

export type BooleanOptions = TypeOptions<boolean>

const boolean = defineType<boolean, BooleanOptions>('boolean', () => ({
  coerce:    value => !!value,
  serialize: value => value,

  validate(value, result) {
    if (typeof value !== 'boolean') {
      result.addError('invalid_type', 'Expected a boolean')
    }
  },
}))

export default boolean