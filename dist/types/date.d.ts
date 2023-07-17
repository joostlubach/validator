import { TypeOptions, Type } from '../typings';
export interface Options extends TypeOptions<Date> {
    after?: Date;
    before?: Date;
}
declare function date(options?: Options): Type<Date>;
export default date;
