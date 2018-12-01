import ValidationContext from './ValidationContext'

export interface Options {
  /// Set to true to ignore unknown attributes
  ignoreUnknown?: boolean

  /// When true, trims all string properties
  trimStrings?: boolean
}

export interface Type<T> {
  options:    TypeOptions<T>
  cast:       (raw: any, context: ValidationContext, partial: boolean) => T | typeof INVALID
  serialize:  (value: T) => any
  validate?:  (raw: any, context: ValidationContext) => void | Promise<void>
}

export const INVALID = Symbol('INVALID')
export type INVALID = typeof INVALID

export type OptionalType<T> = Type<T> & {options: {required: false}}
export type RequiredType<T> = Type<T> & {options: {required: true}}

export type TypeOptions<T> = OptionalTypeOptions<T> | RequiredTypeOptions<T>

export interface CommonTypeOptions {
  required?: boolean

  [key: string]: any // Types may specify any other option as well.
}

export interface OptionalTypeOptions<T> extends CommonTypeOptions {
  validate?: CustomValidator<T>
  required: false
}

export interface RequiredTypeOptions<T> extends CommonTypeOptions {
  required?: true
  default?:  T
}

export interface ObjectSchema {
  [attribute: string]: Type<any>
}

export type ObjectSchemaMap = {
  [type: string]: ObjectSchema
}

/** Extracts the actual type of a dynamic Type definition. */
export type ValueOf<T extends Type<any>> =
  T extends Type<infer U>
    ? T['options'] extends {required: false}
      ? U | null
      : U
    : never

export type SchemaType<S extends ObjectSchema, K extends keyof S> = ValueOf<S[K]>

/** Retrieves a full object type given an object schema. */
export type SchemaInstance<S extends ObjectSchema> = {
  [name in keyof S]: ValueOf<S[name]>
}

/** Retrieves a dynamic polymorphic schema instance. It changes based on the value of its 'type' property. */
export type PolySchemaInstance<SM extends ObjectSchemaMap> = {
  [type in keyof SM]: {type: type} & SchemaInstance<SM[type]>
}[keyof SM]

export type AnyObject = {[key: string]: any}

export interface CustomValidator<T> {
  (value: T, context: ValidationContext): void
}

export interface ValidationResult {
  valid:    boolean
  errors:   ValidationError[]
}

export interface ValidationError {
  path:    string | null
  code:    string | null
  message: string
}