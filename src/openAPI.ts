import { OpenAPIV3_1 } from 'openapi-types'

import { getDocumentationFromDoctext } from './doctext.js'
import { OpenAPISchemaObject, Type } from './typings.js'

export function deriveObjectAPISchema(type: Type<any, any>, options: ObjectAPIOptions = {}) {
  const {injectSchemasInto} = options

  const recurse = (type: Type<any, any> | undefined): OpenAPISchemaObject | OpenAPIV3_1.ReferenceObject => {
    if (type?.openAPI == null) { return {} }

    const documentation = getDocumentationFromDoctext(type)

    const schema = type.openAPI instanceof Function ? type.openAPI(recurse) : type.openAPI
    if (injectSchemasInto != null && type?.openAPISchemaName != null) {
      const path = options.schemaPrefix != null
        ? `${options.schemaPrefix}${type.openAPISchemaName}`
        : type.openAPISchemaName
      
      appendSchema(injectSchemasInto, path, schema)

      return {
        ...documentation,
        $ref: `#/components/schemas/${path}`,
      }
    } else {
      return {
        ...documentation,
        ...schema,
      }
    }
  }

  return recurse(type)
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
