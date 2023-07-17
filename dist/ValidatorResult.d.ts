import { ValidationError, ValidatorResultSerialized } from './typings';
import Validator from './Validator';
export default class ValidatorResult<T> {
    readonly validator: Validator;
    private readonly parts;
    constructor(validator: Validator, parts?: string[]);
    get attribute(): string;
    get path(): string | null;
    for(attribute: string): ValidatorResult<T>;
    get isValid(): boolean;
    private get errors();
    private set errors(value);
    getErrors(): ValidationError[];
    addError(code?: string, message?: string): void;
    addErrors(errors: Omit<ValidationError, 'path'>[]): void;
    clearErrors(): void;
    mergeResult(other: ValidatorResult<any>): void;
    serialize(): ValidatorResultSerialized;
}
