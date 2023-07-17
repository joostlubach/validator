import { dictionary } from '../types';
export default function dictionaryOf(valueType) {
    return (options = {}) => dictionary({ valueType, ...options });
}
