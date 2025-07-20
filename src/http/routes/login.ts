import { compare } from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const loginRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const result = await db
        .select({
          id: schema.users.id,
          password: schema.users.password,
        })
        .from(schema.users)
        .where(and(eq(schema.users.email, email)))

      if (result.length === 0) {
        throw new Error('User not found')
      }

      const user = result[0]

      const doesPasswordMatches = await compare(password, user.password)

      if (!doesPasswordMatches) {
        throw new Error('Invalid password')
      }

      const token = await reply.jwtSign({
        sub: user.id,
      })

      return { token }
    }
  )
}
