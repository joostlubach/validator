import { Type, TypeOptions } from '../typings';
export interface Options extends TypeOptions<Record<string, any>> {
    valueType?: Type<any>;
}
declare function dictionary(options: Options): Type<any>;
export default dictionary;
