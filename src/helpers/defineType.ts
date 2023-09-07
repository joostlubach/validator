import { Type, TypeFn, TypeOptions } from '../typings'

export type TypeConfig<T> = Omit<Type<T>, 'name' | 'options'>

export function defineType<T, Opts extends TypeOptions<T>>(name: string, template: (options: Opts) => TypeConfig<T>): TypeFn<T, Opts> {
  return ((options: Opts) => ({
    name,
    options,
    ...template(options)
  })) as any
}
