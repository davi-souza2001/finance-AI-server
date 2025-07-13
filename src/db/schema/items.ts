import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { categories } from './categories.ts'
import { users } from './users.ts'

export const items = pgTable('items', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id),
  name: text().notNull(),
  description: text(),
  categoryId: uuid().references(() => categories.id),
  price: integer().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})
