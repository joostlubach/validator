import { DOCTEXT_MARKER, ObjectSchema } from '../typings'

export function mergeSchema(target: ObjectSchema, schema: ObjectSchema) {
  const {[DOCTEXT_MARKER]: doctext, ...rest} = schema

  Object.assign(target, rest)
  Object.assign(target[DOCTEXT_MARKER] ??= ({} as any), doctext)
}