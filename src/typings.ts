import { isPlainObject, some } from 'lodash'
import { OpenAPIV3_1 } from 'openapi-types'
import { EmptyObject } from 'ytil'

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

export type Type<T, Opts extends TypeOptions<T>> = RequiredType<T, Opts> | OptionalType<T, Opts>

export interface TypeCommon<T> {
  name:      string
  coerce:    (raw: any, result: ValidatorResult<any>, partial: boolean) => T | typeof INVALID
  serialize: (value: T, parent?: any) => any
  traverse?: (value: T, path: string[], callback: TraverseCallback) => void
  validate?: (raw: any, result: ValidatorResult<any>) => void

  openAPI?:           OpenAPISchemaObject | OpenAPISchemaFn
  openAPISchemaName?: string
}

export type OpenAPISchemaObject = OpenAPIV3_1.SchemaObject & {
  [xKey: `x-${string}`]: any
}

export type OpenAPISchemaFn = (recurse: (type: Type<any, any> | undefined) => OpenAPISchemaObject | OpenAPIV3_1.ReferenceObject) => OpenAPISchemaObject

export interface RequiredType<T, Opts extends TypeOptions<T>> extends TypeCommon<T> {
  options: Opts
}

export interface OptionalType<T, Opts extends TypeOptions<T>> extends TypeCommon<T | null> {
  options: Opts
}

export const INVALID = Symbol('INVALID')
export type INVALID = typeof INVALID

export interface TypeOptions<T> {
  required?: boolean
  default?:  T | (() => T)

  validate?: CustomValidator<T>
  coerce?:   CustomCoerce<T>

  // A custom tag to identify this type.
  tag?: string

  // Custom OpenAPI extensions.
  openAPI?:           OpenAPISchemaObject | (() => OpenAPISchemaObject)
  openAPISchemaName?: string

  // Allow additional options for other libraries to add.
  [key: string]: any
}

export interface TypeFnWithoutOpts<T, Opts extends TypeOptions<T>> {
  (options: Opts & {required: false}): OptionalType<T, Opts>
  (options?: Opts): RequiredType<T, Opts>
}

export interface TypeFnWithOpts<T, Opts extends TypeOptions<T>> {
  (options: Opts & {required: false}): OptionalType<T, Opts>
  (options: Opts): RequiredType<T, Opts>
}

export type TypeFn<T, Opts extends TypeOptions<T>> =
  EmptyObject extends RequiredPartOf<Opts>
    ? TypeFnWithoutOpts<T, Opts>
    : TypeFnWithOpts<T, Opts>

type RequiredKeysOf<T> = {
  [K in keyof T]-?: EmptyObject extends Pick<T, K> ? never : K
}[keyof T]
type RequiredPartOf<T> = Pick<T, RequiredKeysOf<T>>

export type ObjectSchema = Record<string, Type<any, any>>

export interface ObjectSchemaMap {
  [type: string]: ObjectSchema
}

/** Extracts the actual type of a dynamic Type definition. */
export type ValueTypeOf<T extends Type<any, any>> =
  T extends RequiredType<infer U, any> ? U :
    T extends OptionalType<infer U, any> ? U | null :
      never

/** Retrieves a full object type given an object schema. */
export type SchemaInstance<S extends ObjectSchema> = {
  [name in keyof S]: ValueTypeOf<S[name]>
}

/** Retrieves a dynamic polymorphic schema instance. It changes based on the value of its 'type' property. */
export type PolySchemaInstance<SM extends ObjectSchemaMap> = {
  [type in keyof SM]: {type: type} & SchemaInstance<SM[type]>
}[keyof SM]

/** Retrieves a dynamic schema instance containing a union of all properties from all schemas. */
type GetKeys<U> = U extends Record<infer K, any> ? K : never
type UnionToIntersection<U> = {
  [K in GetKeys<U>]: U extends Record<K, infer T> ? T : never
}
export type MergedPolySchemaInstance<SM extends ObjectSchemaMap> = UnionToIntersection<PolySchemaInstance<SM>>

export type ValidateExtraFunction<T> = (result: ValidatorResult<T>) => void | Promise<void>
export type CustomValidator<T> = (value: T, result: ValidatorResult<any>) => void | Promise<void>
export type CustomCoerce<T> = (value: T) => T

export interface ValidatorResultSerialized {
  valid:  boolean
  errors: ValidationError[]
}

export interface ValidationError {
  path:     string | null
  code?:    string
  message?: string
}

export type TraverseCallback = (value: any, path: string, type: Type<any, any>) => void | false | {set: any}

export function isSetResult(result: void | false | {set: any}): result is {set: any} {
  return isPlainObject(result)
}

export const REST_MARKER = '...'
export const DOCTEXT_MARKER = '__doctext__'
