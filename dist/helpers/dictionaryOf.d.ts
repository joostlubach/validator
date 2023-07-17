import { Type, TypeOptions } from '../typings';
type ArrayTypeCreator<T> = (options?: TypeOptions<T[]>) => Type<T[]>;
export default function dictionaryOf<T>(valueType: Type<T>): ArrayTypeCreator<T>;
export {};
