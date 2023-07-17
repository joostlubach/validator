function boolean(options = {}) {
    return {
        name: 'boolean',
        options,
        coerce(value) {
            return !!value;
        },
        serialize(value) {
            return value;
        },
        validate(value, result) {
            if (typeof value !== 'boolean') {
                result.addError('invalid_type', 'Expected a boolean');
            }
        },
    };
}
export default boolean;
