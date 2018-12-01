import {TypeOptions, Type} from '../typings'

export interface Options {
}

function any(options?: TypeOptions<any> & Options & {required: false}): Type<any> & {options: {required: false}}
function any(options?: TypeOptions<any> & Options & {required?: true}): Type<any> & {options: {required: true}}
function any(options: TypeOptions<any> & Options = {}): Type<any> {
  return {
    options,

    cast(value: any) {
      return value
    },

    serialize(value: any) {
      return value
    }
  }
}

export default any