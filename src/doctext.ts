import { Doctext, DoctextReader, Entities as doctext_Entities } from 'doctext'
import { set } from 'lodash'
import { OpenAPIV3_1 } from 'openapi-types'

import { DOCTEXT_MARKER, ObjectSchema, Type } from './typings'

const reader = DoctextReader.createWithEntities<DoctextEntities>(doctext, {
  examples: {
    args:    0,
    content: true,

    add: (entities, _, lines, util) => {
      const summary = util.summary(lines)
      const description = util.body(lines)
      const value = util.entities(lines, 'value').map(it => JSON.parse(it))?.[0]
      const externalValue = util.entities(lines, 'externalValue')?.[0]

      entities.examples.push({
        summary,
        description,
        value,
        externalValue,
      })
    }
  },
})

export function doctext<S extends ObjectSchema>(schema: S): S {
  const result = reader.readSync(schema)

  for (const [prop, doctext] of Object.entries(result.matched)) {
    set(schema, `${prop}.${DOCTEXT_MARKER}`, doctext)
  }

  if (result.unmatched.length > 0) {
    set(schema, DOCTEXT_MARKER, result.unmatched[0])
  }

  return schema
}

export function getDocumentationFromDoctext(arg: ObjectSchema | Type<any, any>): OpenAPIDocumentation {
  const doctext = (arg as any)[DOCTEXT_MARKER] as Doctext<DoctextEntities> | undefined
  if (doctext == null) { return {} }

  return {
    title:        doctext.summary,
    description:  doctext.body,
    examples:     doctext.entities.examples,
    externalDocs: doctext.entities.links?.map(link => ({url: link.href, description: link.caption}))?.[0],
  }
}

export interface DoctextEntities extends doctext_Entities {
  examples: OpenAPIV3_1.ExampleObject[]
}

export interface OpenAPIDocumentation {
  title?:        string
  description?:  string
  examples?:     OpenAPIV3_1.ExampleObject[]
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject
}
