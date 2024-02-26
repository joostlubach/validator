import { Doctext, DoctextReader } from 'doctext'
import { set } from 'lodash'
import { OpenAPIV3_1 } from 'openapi-types'

import { DOCTEXT_MARKER, ObjectSchema, OpenAPISchemaObject, Type } from './typings'

export function deriveObjectAPISchema(type: Type<any, any>, options: ObjectAPIOptions = {}) {
  const {injectSchemasInto} = options

  const recurse = (type: Type<any, any> | undefined): OpenAPISchemaObject | OpenAPIV3_1.ReferenceObject => {
    if (type?.openAPI == null) { return {} }

    const doctext = getDoctext(type)
    const schema = type.openAPI instanceof Function ? type.openAPI(recurse) : type.openAPI
    if (injectSchemasInto != null && type?.openAPISchemaName != null) {
      const path = options.schemaPrefix != null
        ? `${options.schemaPrefix}${type.openAPISchemaName}`
        : type.openAPISchemaName
      
      appendSchema(injectSchemasInto, path, schema)

      return {
        description: doctext?.description,
        $ref:        `#/components/schemas/${path}`,
      }
    } else {
      return {
        description: doctext?.description,
        ...schema,
      }
    }
  }

  return recurse(type)
}

export function doctext<S extends ObjectSchema>(schema: S): S {
  const reader = DoctextReader.create(doctext)
  const result = reader.readSync(schema)

  for (const [prop, doctext] of Object.entries(result.matched)) {
    set(schema, `${prop}.${DOCTEXT_MARKER}`, doctext)
  }

  if (result.unmatched.length > 0) {
    set(schema, DOCTEXT_MARKER, result.unmatched[0])
  }

  return schema
}

export function getDoctext(type: Type<any, any>): Doctext | null {
  const doctext = (type as any)[DOCTEXT_MARKER] as Doctext | undefined
  return doctext ?? null
}

function appendSchema(document: OpenAPIV3_1.Document, path: string, schema: OpenAPIV3_1.SchemaObject) {
  const head = path.split('/').filter(Boolean)
  const tail = head.pop()
  if (tail == null) { return }

  document.components ??= {}

  let current = document.components.schemas ??= {}
  for (const part of head) {
    current[part] ??= {}
    current = current[part] as any
  }

  current[tail] = schema
}

export interface ObjectAPIOptions {
  /**
   * When set, the algorithm will try to flatten common object schemas into reusable components.
   */
  injectSchemasInto?: OpenAPIV3_1.Document

  /**
   * When using the injectSchemasInto option, use this prefix to namespace the schemas.
   */
  schemaPrefix?: string
}