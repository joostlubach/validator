import { TypeOptions } from '../typings'
import { defineType } from '../util'

export type AnyOptions = TypeOptions<any>

const any = defineType<any, AnyOptions>('any', () => ({
  coerce:    value => value,
  serialize: value => value,
}))

export default any
