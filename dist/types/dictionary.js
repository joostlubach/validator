import { any } from '../types';
import object, { REST_MARKER } from './object';
function dictionary(options) {
    const { valueType = any({ required: false }), ...rest } = options;
    return object({
        schema: {
            [REST_MARKER]: valueType,
        },
        ...rest,
    });
}
export default dictionary;
