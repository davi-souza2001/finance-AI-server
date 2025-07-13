import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  monthlySpending: integer().notNull().default(0),
  createdAt: timestamp().defaultNow().notNull(),
})
