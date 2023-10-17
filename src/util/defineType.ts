import { INVALID, TraverseCallback, TypeFn, TypeOptions } from '../typings'
import ValidatorResult from '../ValidatorResult'

export interface TypeConfig<T> {
  coerce:     (raw: any, result: ValidatorResult<any>, partial: boolean) => T | typeof INVALID
  serialize:  (value: T, parent?: any) => any
  traverse?:  (value: T, path: string[], callback: TraverseCallback) => void
  validate?:  (raw: any, result: ValidatorResult<any>) => void
}


export function defineType<T, Opts extends TypeOptions<T>>(name: string, template: (options: Opts) => TypeConfig<T>): TypeFn<T, Opts> {
  return ((options: Opts = {} as Opts) => ({
    ...template(options),
    name,
    options,
  })) as any
}
