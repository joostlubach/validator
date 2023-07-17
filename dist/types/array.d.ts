import { Type, TypeOptions } from '../typings';
export interface Options<T> extends TypeOptions<T[]> {
    itemType: Type<T>;
    minElements?: number;
    maxElements?: number;
}
declare function array<T>(options: Options<T>): Type<T[]>;
export default array;
