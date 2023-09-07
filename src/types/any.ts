import { defineType } from '../helpers/defineType'
import { TypeOptions } from '../typings'

export type AnyOptions = TypeOptions<any>

const any = defineType<any, AnyOptions>('any', () => ({
  coerce:    value => value,
  serialize: value => value,
}))

export default any