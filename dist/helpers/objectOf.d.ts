import { ObjectSchema, TypeOptions, Type, SchemaInstance } from '../typings';
import { ObjectOptions } from '../types';
type ObjectTypeCreator<S extends ObjectSchema> = (options?: TypeOptions<SchemaInstance<S>>) => Type<SchemaInstance<S>>;
export default function objectOf<S extends ObjectSchema>(schema: S, defaultOptions?: ObjectOptions): ObjectTypeCreator<S>;
export {};
