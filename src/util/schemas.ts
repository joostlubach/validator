import { objectKeys } from 'ytil'

import { DOCTEXT_MARKER, ObjectSchema, REST_MARKER } from '../typings'

export function mergeSchema(target: ObjectSchema, schema: ObjectSchema) {
  const {[DOCTEXT_MARKER]: doctext, ...rest} = schema

  Object.assign(target, rest)
  Object.assign(target[DOCTEXT_MARKER] ??= ({} as any), doctext)
}

export function schemaKeys(schema: ObjectSchema) {
  return objectKeys(schema).filter(it => it !== REST_MARKER && it !== DOCTEXT_MARKER)
}

export function schemaEntries(schema: ObjectSchema) {
  return schemaKeys(schema).map(key => [key, schema[key]] as const)
}