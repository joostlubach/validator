import { INVALID } from '../typings';
import { isDate } from 'lodash';
function date(options = {}) {
    return {
        name: 'date',
        options,
        coerce(value) {
            if (isDate(value)) {
                return value;
            }
            if (typeof value === 'number' || typeof value === 'string') {
                return new Date(value);
            }
            else {
                return INVALID;
            }
        },
        serialize(value) {
            return value;
        },
        validate(value, result) {
            if (!(value instanceof Date) || isNaN(value.getTime())) {
                result.addError('invalid_type', 'Expected a date');
                return;
            }
            if (options.after != null && value < options.after) {
                result.addError('date.too_early', `This value should be after ${options.after}`);
            }
            if (options.before != null && value > options.before) {
                result.addError('date.too_late', `This value should be before ${options.before}`);
            }
        },
    };
}
export default date;
