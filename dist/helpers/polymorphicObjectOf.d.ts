import { ObjectSchema, Type, TypeOptions } from '../typings';
type PolymorphicObjectTypeCreator<T> = (options?: TypeOptions<Record<string, any> & {
    type: T;
}> & {
    extra?: ObjectSchema;
}) => Type<Record<string, any> & {
    type: T;
}>;
export default function polymorphicObjectOf<T extends string>(schemas: Record<T, ObjectSchema>): PolymorphicObjectTypeCreator<T>;
export {};
