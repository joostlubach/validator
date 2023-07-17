function string(options = {}) {
    return {
        name: 'string',
        options,
        coerce(value, result) {
            let text = value == null ? '' : `${value}`;
            if (result.validator.options.trimStrings) {
                text = text.trim();
            }
            if (options.transform != null) {
                return options.transform(text);
            }
            return text;
        },
        serialize(value) {
            return value;
        },
        validate(value, result) {
            if (typeof value !== 'string') {
                result.addError('invalid_type', 'Expected a string');
                return;
            }
            const { minLength = options.required === false ? undefined : 1, maxLength, enum: enumValues, match, } = options;
            if (minLength != null && value.length < minLength) {
                if (minLength === 1) {
                    result.addError('required', "This value is required");
                }
                else {
                    result.addError('string.too_short', `This value should be no shorter than ${minLength} character(s)`);
                }
            }
            if (maxLength != null && value.length > maxLength) {
                result.addError('string.too_long', `This value should be no longer than ${maxLength} character(s)`);
            }
            if (enumValues != null && !enumValues.includes(value)) {
                result.addError('string.not_in_enum', 'Invalid value');
            }
            if (match != null && !match.test(value)) {
                result.addError('string.invalid', "This value is not correctly formatted");
            }
        },
    };
}
export default string;
