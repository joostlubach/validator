import { array } from '../types';
export default function arrayOf(itemType) {
    return (options = {}) => array({ itemType, ...options });
}
