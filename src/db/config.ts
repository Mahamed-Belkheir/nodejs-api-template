import { Configuration } from "../config";
import * as path from "path";
import {
    EntityCaseNamingStrategy,
    Options,
    PostgreSqlDriver,
} from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

const config: Options = {
    driver: PostgreSqlDriver,
    host: Configuration.db.host,
    dbName: Configuration.db.database,
    password: Configuration.db.password,
    user: Configuration.db.user,
    extensions: [Migrator],
    allowGlobalContext: true,
    entities: [path.join(__dirname, "../domain/entities/*/**.js")],
    entitiesTs: [path.join(__dirname, "../domain/entities/*/**.ts")],
    namingStrategy: EntityCaseNamingStrategy,
    migrations: {
        path: path.join(__dirname, "./migrations"),
    },
    forceUndefined: true,
    ignoreUndefinedInQuery: true,
};

export default config;
