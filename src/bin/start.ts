import "reflect-metadata";
import { container } from "tsyringe";
import { configureMikro } from "../db";
import { CreateAPI } from "../api";
import { serve } from "@hono/node-server";
import { Configuration } from "../config";
import { BaseLogger } from "../util/logger";
import { MikroORM } from "@mikro-orm/postgresql";

(async () => {
    const mikroORM = await configureMikro();
    container.register(MikroORM, { useValue: mikroORM });

    const log = container.resolve(BaseLogger);

    const app = CreateAPI(container);

    await mikroORM.migrator.up();

    serve(
        {
            fetch: app.fetch,
            port: Configuration.server.port,
        },
        (info) => log.info("server listening at port: " + info.port),
    );
})();
