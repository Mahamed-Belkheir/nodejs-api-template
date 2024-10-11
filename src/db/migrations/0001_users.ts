import { Knex } from "knex";
import { entityId, timestamps } from "../../util/migrations";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (t) => {
        entityId(t, knex);
        t.string("fullName");
        t.string("email").unique();
        t.string("password");
        timestamps(t, knex);
    });
}
export async function down(): Promise<void> {
    throw new Error("Do not migrate down");
}
