import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (t) => {
        void t;
        throw new Error("not implemented yet");
    });
}
export async function down(): Promise<void> {
    throw new Error("Do not migrate down");
}
