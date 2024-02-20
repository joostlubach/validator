import { TypeOptions } from '../typings'
import { defineType } from '../util'

export type BooleanOptions = TypeOptions<boolean>

const boolean = defineType<boolean, BooleanOptions>('boolean', () => ({
  coerce:    value => !!value,
  serialize: value => value,

  validate(value, result) {
    if (typeof value !== 'boolean') {
      result.addError('invalid_type', 'Expected a boolean')
    }
  },

  openAPI: () => ({type: 'boolean'}),
}))

export default boolean
