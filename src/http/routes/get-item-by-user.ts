import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getItemByUserRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/items/:userId',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { userId } = request.params

      const result = await db
        .select({
          id: schema.items.id,
          name: schema.items.name,
          description: schema.items.description,
          categoryId: schema.items.categoryId,
          price: schema.items.price,
        })
        .from(schema.items)
        .where(eq(schema.items.userId, userId))
        .orderBy(schema.items.createdAt)

      return result
    }
  )
}
