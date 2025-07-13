import { and, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const deleteItemRoute: FastifyPluginCallbackZod = (app) => {
  app.delete(
    '/items/:itemId',
    {
      schema: {
        body: z.object({
          userId: z.string().uuid(),
        }),
        params: z.object({
          itemId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { userId } = request.body
      const { itemId } = request.params

      const result = await db
        .delete(schema.items)
        .where(
          and(eq(schema.items.id, itemId), eq(schema.items.userId, userId))
        )

      return result
    }
  )
}
