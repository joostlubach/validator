import { AnyObject, CustomCoerce, ObjectSchema, ObjectSchemaMap, Type, TypeOptions } from '../typings';
export type Options = TypeOptions<AnyObject> & (SchemalessOptions | MonomorphicOptions<any> | PolymorphicOptions<any>);
interface SchemalessOptions {
}
interface MonomorphicOptions<S extends ObjectSchema> {
    polymorphic?: false;
    schema?: S;
    coerce?: CustomCoerce<AnyObject>;
}
interface PolymorphicOptions<S extends ObjectSchemaMap> {
    polymorphic: true;
    schemas: S;
    coerce?: CustomCoerce<AnyObject>;
}
export default function object(options?: Options): Type<AnyObject>;
export declare const REST_MARKER = "...";
export {};
