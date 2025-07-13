import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createItemRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/items',
    {
      schema: {
        body: z.object({
          userId: z.string().uuid(),
          name: z.string().min(1),
          description: z.string().optional(),
          categoryId: z.string().uuid(),
          price: z.number().min(0),
        }),
      },
    },
    async (request, reply) => {
      const { userId, name, description, categoryId, price } = request.body

      const result = await db
        .insert(schema.items)
        .values({
          userId,
          name,
          description,
          categoryId,
          price,
        })
        .returning()

      const insertedItem = result[0]

      if (!insertedItem) {
        throw new Error('Failed to create new item.')
      }

      return reply.status(201).send({ itemId: insertedItem.id })
    }
  )
}
