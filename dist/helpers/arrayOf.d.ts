import { TypeOptions, Type } from '../typings';
type ArrayTypeCreator<T> = (options?: TypeOptions<T[]>) => Type<T[]>;
export default function arrayOf<T>(itemType: Type<T>): ArrayTypeCreator<T>;
export {};
