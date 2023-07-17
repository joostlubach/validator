import ValidatorResult from './ValidatorResult';
export interface Options {
    ignoreUnknown?: boolean;
    trimStrings?: boolean;
}
export declare const Options: {
    defaults: Required<Options>;
    isOptions: (opts: any) => opts is Options;
};
export interface Type<T> {
    name: string;
    options: TypeOptions<T>;
    coerce: (raw: any, result: ValidatorResult<any>, partial: boolean) => T | typeof INVALID;
    serialize: (value: T, parent?: any) => any;
    traverse?: (value: T, path: string[], callback: TraverseCallback) => void;
    validate?: (raw: any, result: ValidatorResult<any>) => void;
}
export declare const INVALID: unique symbol;
export type INVALID = typeof INVALID;
export interface TypeOptions<T> {
    required?: boolean;
    default?: any | (() => any);
    validate?: CustomValidator<T>;
    tag?: string;
    [key: string]: any;
}
export type ObjectSchema = {
    [attribute: string]: Type<any>;
};
export interface ObjectSchemaMap {
    [type: string]: ObjectSchema;
}
/** Extracts the actual type of a dynamic Type definition. */
export type ValueOf<T extends Type<any>> = T extends Type<infer U> ? T['options'] extends {
    required: false;
} ? U | null : U : never;
export type SchemaType<S extends ObjectSchema, K extends keyof S> = ValueOf<S[K]>;
/** Retrieves a full object type given an object schema. */
export type SchemaInstance<S extends ObjectSchema> = {
    [name in keyof S]: ValueOf<S[name]>;
};
/** Retrieves a dynamic polymorphic schema instance. It changes based on the value of its 'type' property. */
export type PolySchemaInstance<SM extends ObjectSchemaMap> = {
    [type in keyof SM]: {
        type: type;
    } & SchemaInstance<SM[type]>;
}[keyof SM];
export type AnyObject = Record<string, any>;
export type ValidateExtraFunction<T> = (result: ValidatorResult<T>) => void | Promise<void>;
export type CustomValidator<T> = (value: T, result: ValidatorResult<any>) => void | Promise<void>;
export type CustomCoerce<T> = (value: T) => T;
export interface ValidatorResultSerialized {
    valid: boolean;
    errors: ValidationError[];
}
export interface ValidationError {
    path: string | null;
    code?: string;
    message?: string;
}
export type TraverseCallback = (value: any, path: string, type: Type<any>) => void | false | {
    set: any;
};
export declare function isSetResult(result: void | false | {
    set: any;
}): result is {
    set: any;
};
export declare const COERCE: unique symbol;
