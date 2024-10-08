import Knex from "knex";
import { Configuration } from "../config";
import * as path from "path";

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

export const knex = Knex(structuredClone(knexConfig));
