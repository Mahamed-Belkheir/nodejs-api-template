import { Knex } from "knex";

export function timestamps(t: Knex.CreateTableBuilder, knex: Knex) {
    t.timestamp("createdAt").index().defaultTo(knex.fn.now());
    t.timestamp("updatedAt").index().defaultTo(knex.fn.now());
}

export function entityId(t: Knex.CreateTableBuilder, knex: Knex) {
    t.uuid("id").primary().defaultTo(knex.fn.uuid);
}
