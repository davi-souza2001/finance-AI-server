import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createCategoryRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/categories',
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { name } = request.body

      const result = await db
        .insert(schema.categories)
        .values({
          name,
        })
        .returning()

      const insertedCategory = result[0]

      if (!insertedCategory) {
        throw new Error('Failed to create new category.')
      }

      return reply.status(201).send({ categoryId: insertedCategory.id })
    }
  )
}
