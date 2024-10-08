import { Context as Ctx, Get, Http } from "@dikur/http";
import { HonoAdapator } from "@dikur/hono";
import { DependencyContainer, singleton } from "tsyringe";
import { Context, Hono } from "hono";
import { ajv } from "./util/ajv";
import { ClientError } from "./errors";
import { BaseLogger } from "./util/logger";
import { StatusCode } from "hono/utils/http-status";

@singleton()
@Http("/api")
export class Api {
    @Get("/health")
    async healthCheck(@Ctx() ctx: Context) {
        return ctx.text("OK");
    }
}

export function CreateAPI(container: DependencyContainer) {
    const api = new Hono();

    HonoAdapator(Api, api, (clz) => container.resolve(clz), ajv);

    const log = container.resolve(BaseLogger);

    api.onError(async (err, ctx) => {
        const status = "error";
        if (err instanceof ClientError) {
            ctx.status(err.httpCode as StatusCode);
            return ctx.json({
                status,
                message: err.message,
            });
        }
        log.error(err);
        return ctx.json({
            status,
            message: "internal server error",
        });
    });

    api.notFound(async (ctx) => {
        ctx.status(404);
        return ctx.json({
            status: "error",
            message: "not found",
        });
    });
    return api;
}
