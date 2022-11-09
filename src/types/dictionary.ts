import { Type, TypeOptions } from '../typings'
import object from './object'

export interface Options extends TypeOptions<Record<string, any>> {
  valueType: Type<any>
}

function dictionary(options: Options): Type<any> {
  const {valueType, ...rest} = options
  return object({
    schema: {
      __rest: valueType,
    },
    ...rest,
  } as any)
}

export default dictionary