import { OpenAPIV3_1 } from 'openapi-types'

import { OpenAPISchemaObject, Type } from './typings'

export function deriveObjectAPISchema(type: Type<any, any>, options: ObjectAPIOptions = {}) {
  const {injectSchemasInto} = options

  const recurse = (type: Type<any, any> | undefined): OpenAPISchemaObject | OpenAPIV3_1.ReferenceObject => {
    if (type?.openAPI == null) { return {} }

    const schema = type.openAPI instanceof Function ? type.openAPI(recurse) : type.openAPI
    if (injectSchemasInto != null && type?.openAPISchemaName != null) {
      const name = options.schemaPrefix != null
        ? `${options.schemaPrefix}${type.openAPISchemaName}`
        : type.openAPISchemaName
      
      injectSchemasInto.components ??= {}
      injectSchemasInto.components.schemas ??= {}
      injectSchemasInto.components.schemas[name] = schema

      return {
        $ref: `#/components/schemas/${name}`,
      }
    } else {
      return schema
    }
  }

  return recurse(type)
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