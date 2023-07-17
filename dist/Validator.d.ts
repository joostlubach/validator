import { INVALID, Options, Type, ValidateExtraFunction, ValidationError } from './typings';
import ValidatorResult from './ValidatorResult';
export default class Validator {
    constructor(options?: Options);
    protected errors: ValidationError[];
    options: Required<Options>;
    coerce<T>(raw: any, type: Type<T>, partial: boolean): T | INVALID;
    validate<T>(data: T, type: Type<T>, validateExtra?: ValidateExtraFunction<T>): Promise<ValidatorResult<T>>;
    validateType<T>(value: T | null, type: Type<T>, result?: ValidatorResult<T>): ValidatorResult<T>;
}
