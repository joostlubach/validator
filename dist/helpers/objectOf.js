import { object } from '../types';
export default function objectOf(schema, defaultOptions = {}) {
    return (options = {}) => object({ schema, ...defaultOptions, ...options });
}
