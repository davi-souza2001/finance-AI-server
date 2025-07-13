import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
})
