function any(options = {}) {
    return {
        name: 'any',
        options,
        coerce(value) {
            return value;
        },
        serialize(value) {
            return value;
        },
    };
}
export default any;
