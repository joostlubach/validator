import { TypeOptions, Type } from '../typings';
export interface Options extends TypeOptions<number> {
    integer?: boolean;
    min?: number;
    max?: number;
}
declare function number(options?: Options): Type<number>;
export default number;
