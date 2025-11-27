
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      source: '**',
      type: 'page',
      schema: z.object({
        rawbody: z.string()
      })
    })
  }
})
