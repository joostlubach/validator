import { string } from '../types';
export default function enumOf(enumLike, defaultOptions = {}) {
    return (options = {}) => string({
        enum: enumValues(enumLike),
        ...defaultOptions,
        ...options,
    });
}
function enumValues(enumLike) {
    return Object.values(enumLike);
}
