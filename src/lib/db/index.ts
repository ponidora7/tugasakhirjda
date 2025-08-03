// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export type User = typeof schema.users.$inferSelect;
export type Post = typeof schema.posts.$inferSelect;
export type Comment = typeof schema.comments.$inferSelect;

export type NewUser = typeof schema.users.$inferInsert;
export type NewPost = typeof schema.posts.$inferInsert;
export type NewComment = typeof schema.comments.$inferInsert;