import "reflect-metadata";
import { container } from "tsyringe";
import { knexConfig, KnexRef } from "../db";
import Knex from "knex";
import { CreateAPI } from "../api";
import { serve } from "@hono/node-server";
import { Configuration } from "../config";

(async () => {
    const knex = Knex(knexConfig);
    container.register(KnexRef, { useValue: knex });

    const app = CreateAPI(container);

    await knex.migrate.latest();

    serve(
        {
            fetch: app.fetch,
            port: Configuration.server.port,
        },
        (info) => console.log("server listening at port: " + info.port),
    );
})();
