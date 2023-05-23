import { sql } from "kysely"
import { TiroRds } from "core/rds"

export async function handler(_: any) {
  try {

    await TiroRds.db.schema
      .createTable('subscriber')
      .addColumn('email_address', 'varchar(255)', (col) => col.primaryKey())
      .addColumn('verified', 'integer', (col) => col.defaultTo(0).notNull())
      .addColumn('tech_subscribed', 'integer', (col) => col.defaultTo(0).notNull())
      .addColumn('web_subscribed', 'integer', (col) => col.defaultTo(0).notNull())
      .addColumn('ai_subscribed', 'integer', (col) => col.defaultTo(0).notNull())
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
      .execute()

    console.log("INFO: subscriber table is created successfully.")

    await TiroRds.db.schema
      .createTable('email_verification_token')
      .addColumn('email_address', 'varchar(255)', (col) => col.notNull())
      .addColumn('encrypted_token', 'text', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
      .addForeignKeyConstraint(
        'email_address_on_subscriber_tbl', ['email_address'], 
        'subscriber', ['email_address'])
      .execute()

    console.log("INFO: email_verification_token table is created successfully.")
    
  } catch (e: any) {
    console.error(e)
  }
}
