import { isPlainObject, some } from 'lodash'
import ValidatorResult from './ValidatorResult'

export interface Options {
  /// Set to true to ignore unknown attributes
  ignoreUnknown?: boolean

  /// When true, trims all string properties
  trimStrings?: boolean
}

export const Options: {
  defaults:  Required<Options>
  isOptions: (opts: any) => opts is Options
} = {
  defaults: {
    ignoreUnknown: true,
    trimStrings:   true,
  },
  isOptions: (opts): opts is Options => {
    if (!isPlainObject(opts)) { return false }
    if (some(Object.keys(opts), it => !(it in Options.defaults))) { return false }
    return true
  },
}

export interface Type<T> {
  name:       string
  options:    TypeOptions<T>
  coerce:     (raw: any, result: ValidatorResult<any>, partial: boolean) => T | typeof INVALID
  serialize:  (value: T, parent?: any) => any
  traverse?:  (value: T, path: string[], callback: TraverseCallback) => void
  validate?:  (raw: any, result: ValidatorResult<any>) => void
}

export type TypeCreator<T, Opts = TypeOptions<T>> = (
  & ((options: Opts & {required: false}) => Type<T | null>)
  & ((options?: Opts) => Type<T>)
)

export const INVALID = Symbol('INVALID')
export type INVALID = typeof INVALID

export interface TypeOptions<T> {
  required?: boolean
  default?:  T | (() => T)

  validate?: CustomValidator<T>
  coerce?:   CustomCoerce<T>

  // A custom tag to identify this type.
  tag?: string
}

export interface TypeFnWithoutOpts<T, Opts extends TypeOptions<T>> {
  (options: Opts & {required: false}): Type<T | null>
  (options?: Opts): Type<T>
}

export interface TypeFnWithOpts<T, Opts extends TypeOptions<T>> {
  (options: Opts & {required: false}): Type<T | null>
  (options: Opts): Type<T>
}

export type TypeFn<T, Opts extends TypeOptions<T>> =
  {} extends RequiredPartOf<Opts> ? TypeFnWithoutOpts<T, Opts> : TypeFnWithOpts<T, Opts>

type RequiredKeysOf<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]
type RequiredPartOf<T> = Pick<T, RequiredKeysOf<T>>

export type ObjectSchema = {
  [attribute: string]: Type<any>
}

export interface ObjectSchemaMap {
  [type: string]: ObjectSchema
}

/** Extracts the actual type of a dynamic Type definition. */
export type ValueTypeOf<T extends Type<any>> = T extends Type<infer U> ? U : never

/** Retrieves a full object type given an object schema. */
export type SchemaInstance<S extends ObjectSchema> = {
  [name in keyof S]: ValueTypeOf<S[name]>
}

/** Retrieves a dynamic polymorphic schema instance. It changes based on the value of its 'type' property. */
export type PolySchemaInstance<SM extends ObjectSchemaMap> = {
  [type in keyof SM]: {type: type} & SchemaInstance<SM[type]>
}[keyof SM]

export type ValidateExtraFunction<T> = (result: ValidatorResult<T>) => void | Promise<void>
export type CustomValidator<T>       = (value: T, result: ValidatorResult<any>) => void | Promise<void>
export type CustomCoerce<T>          = (value: T) => T

export interface ValidatorResultSerialized {
  valid:    boolean
  errors:   ValidationError[]
}

export interface ValidationError {
  path:     string | null
  code?:    string
  message?: string
}

export type TraverseCallback = (value: any, path: string, type: Type<any>) => void | false | {set: any}

export function isSetResult(result: void | false | {set: any}): result is {set: any} {
  return isPlainObject(result)
}