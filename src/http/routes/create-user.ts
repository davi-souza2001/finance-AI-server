import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(8),
          monthlySpending: z.number().min(0),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password, monthlySpending } = request.body

      const result = await db
        .insert(schema.users)
        .values({
          name,
          email,
          password,
          monthlySpending,
        })
        .returning()

      const insertedUser = result[0]

      if (!insertedUser) {
        throw new Error('Failed to create new user.')
      }

      return reply.status(201).send({ userId: insertedUser.id })
    }
  )
}
