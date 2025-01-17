import "reflect-metadata";
import { container } from "tsyringe";
import { configureMikro, knexConfig, KnexRef } from "../db";
import Knex from "knex";
import { CreateAPI } from "../api";
import { serve } from "@hono/node-server";
import { Configuration } from "../config";
import { BaseLogger } from "../util/logger";
import { MikroORM } from "@mikro-orm/postgresql";

(async () => {
    const knex = Knex(knexConfig);
    container.register(KnexRef, { useValue: knex });

    const mikroORM = await configureMikro(knex);
    container.register(MikroORM, { useValue: mikroORM });

    const log = container.resolve(BaseLogger);

    const app = CreateAPI(container);

    await knex.migrate.latest();

    serve(
        {
            fetch: app.fetch,
            port: Configuration.server.port,
        },
        (info) => log.info("server listening at port: " + info.port),
    );
})();
