import { TiroRds } from "core/rds"

export async function handler() {
  const record = await TiroRds.db
    .selectFrom("subscriber")
    .select("tech_subscribed")
    .select("created_at")
    .executeTakeFirstOrThrow();

  return {
    statusCode: 200,
    body: record,
  };
}