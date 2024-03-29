import { TypeOptions } from '../typings.js'
import { defineType } from '../util/index.js'

export type AnyOptions = TypeOptions<any>

const any = defineType<any, AnyOptions>('any', () => ({
  coerce:    value => value,
  serialize: value => value,
}))

export default any
