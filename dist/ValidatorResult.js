export default class ValidatorResult {
    validator;
    parts;
    constructor(validator, parts = []) {
        this.validator = validator;
        this.parts = parts;
    }
    //------
    // Attributes & paths
    get attribute() {
        if (this.parts.length === 0) {
            return '<root>';
        }
        return this.parts[this.parts.length - 1];
    }
    get path() {
        if (this.parts.length === 0) {
            return null;
        }
        return this.parts.join('.');
    }
    for(attribute) {
        return new ValidatorResult(this.validator, this.parts.concat([attribute]));
    }
    //------
    // Errors & valid
    get isValid() {
        return this.getErrors().length === 0;
    }
    get errors() {
        // Note: errors is protected, but should be like library-protected.
        return this.validator.errors;
    }
    set errors(value) {
        // Note: errors is protected, but should be like library-protected.
        this.validator.errors = value;
    }
    getErrors() {
        return this.errors.filter(error => {
            if (this.path == null) {
                return true;
            }
            if (error.path === this.path) {
                return true;
            }
            return error.path?.startsWith(this.path + '.');
        });
    }
    addError(code, message) {
        this.errors.push({
            path: this.path ?? null,
            code,
            message,
        });
    }
    addErrors(errors) {
        this.errors.push(...errors.map(err => ({ path: this.path ?? null, ...err })));
    }
    clearErrors() {
        this.errors = this.errors.filter(error => error.path !== this.path);
    }
    mergeResult(other) {
        const result = other.parts.reduce((curr, part) => curr.for(part), this);
        result.addErrors(other.getErrors());
    }
    //------
    // Serialization
    serialize() {
        const errors = this.getErrors();
        return {
            valid: errors.length === 0,
            errors: errors,
        };
    }
}
