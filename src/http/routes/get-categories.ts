import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getCategoriesRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/categories', async () => {
    const results = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
      })
      .from(schema.categories)
      .orderBy(schema.categories.name)

    return results
  })
}
