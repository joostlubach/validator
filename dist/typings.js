import { isPlainObject, some } from 'lodash';
export const Options = {
    defaults: {
        ignoreUnknown: true,
        trimStrings: true,
    },
    isOptions: (opts) => {
        if (!isPlainObject(opts)) {
            return false;
        }
        if (some(Object.keys(opts), it => !(it in Options.defaults))) {
            return false;
        }
        return true;
    },
};
export const INVALID = Symbol('INVALID');
export function isSetResult(result) {
    return isPlainObject(result);
}
export const COERCE = Symbol('validator.coerce');
