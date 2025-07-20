import { and, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getUserByIdRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/get-user-by-id/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request) => {
      const { id } = request.params

      const result = await db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          createdAt: schema.users.createdAt,
          password: schema.users.password,
        })
        .from(schema.users)
        .where(and(eq(schema.users.id, id)))

      if (result.length === 0) {
        throw new Error('User not found')
      }

      const user = {
        id: result[0]?.id,
        name: result[0]?.name,
        email: result[0]?.email,
        createdAt: result[0]?.createdAt,
      }

      return user
    }
  )
}
