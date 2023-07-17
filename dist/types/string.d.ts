import { Type, TypeOptions } from '../typings';
export interface Options extends TypeOptions<string> {
    minLength?: number;
    maxLength?: number;
    enum?: string[];
    match?: RegExp;
    transform?: (value: string) => string;
}
declare function string(options?: Options): Type<string>;
export default string;
