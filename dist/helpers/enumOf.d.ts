import { StringOptions } from '../types';
import { ObjectSchema, SchemaInstance, Type, TypeOptions } from '../typings';
type ObjectTypeCreator<S extends ObjectSchema> = (options?: TypeOptions<SchemaInstance<S>>) => Type<SchemaInstance<S>>;
export default function enumOf<S extends ObjectSchema>(enumLike: Record<string, any>, defaultOptions?: StringOptions): ObjectTypeCreator<S>;
export {};
