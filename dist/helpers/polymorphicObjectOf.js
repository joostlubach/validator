import { object } from '../types';
export default function polymorphicObjectOf(schemas) {
    return (options = {}) => object({
        polymorphic: true,
        schemas: Object.entries(schemas).reduce((acc, [type, schema]) => ({
            ...acc,
            [type]: { ...schema, ...options.extra }
        }), {}),
        ...options,
    });
}
