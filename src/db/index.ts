import { Knex } from "knex";
import { Configuration } from "../config";
import * as path from "path";
import {
    EntityCaseNamingStrategy,
    PostgreSqlDriver,
} from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/core";

export const KnexRef = "knex_ref";

export const knexConfig = {
    client: "pg",
    connection: {
        ...Configuration.db,
    },
    migrations: {
        directory: path.join(__dirname, "/migrations"),
    },
};

export function configureMikro(knex: Knex) {
    return MikroORM.init({
        driver: PostgreSqlDriver,
        driverOptions: knex,
        dbName: Configuration.db.database,
        password: Configuration.db.password,
        entities: [path.join(__dirname, "../domain/entities/**.js")],
        entitiesTs: [path.join(__dirname, "../domain/entities/**.ts")],
        namingStrategy: EntityCaseNamingStrategy,
    });
}
