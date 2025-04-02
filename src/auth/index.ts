import { MikroORM } from "@mikro-orm/postgresql";
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { mikroOrmAdapter } from "better-auth-mikro-orm";
import { container } from "tsyringe";
import { Context, Next } from "hono";
import { UserContext } from "../ctx/user";
import { TUser } from "../schemas/user";
import { Middleware } from "@dikur/http";
import { res } from "../util/response";
import { JSONResponse } from "../util/openapi";
import { Secured } from "@dikur/openapi";
import { BaseLogger } from "../util/logger";

export const AuthRef = Symbol("auth");

export const getAuth = () =>
    container.resolve<ReturnType<typeof betterAuth>>(AuthRef);

export const setupAuth = () => {
    const orm = container.resolve(MikroORM);
    const logger = container.resolve(BaseLogger);

    return betterAuth({
        database: mikroOrmAdapter(orm),
        // basePath: Configuration.server.basePath,
        emailAndPassword: {
            enabled: true,
        },
        logger: {
            log: (level, msg, ...data) =>
                logger.info({ data }, `[auth] ${level}: ${msg}`),
        },
        plugins: [openAPI()],
    });
};

export async function setupUserContext(ctx: Context, next: Next) {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: ctx.req.raw.headers });
    if (!session || !session.user) {
        return next();
    }
    return container.resolve(UserContext).start(session.user as TUser, next);
}

export const authUser = () => {
    return (target: any, key?: string) => {
        Middleware((ctx, next) => {
            const user = container.resolve(UserContext).getOptional();
            if (!user) {
                return res(ctx).err.msg("unauthorized", 401);
            }
            return next();
        });
        if (key) {
            JSONResponse.err.msg("unauthenticated", "401")(target, key, {});
            JSONResponse.err.msg("unauthorized", "403")(target, key, {});
            Secured({ access_token: [] })(target, key, {});
        } else {
            for (const key in target) {
                JSONResponse.err.msg("unauthenticated", "401")(target, key, {});
                JSONResponse.err.msg("unauthorized", "403")(target, key, {});
                Secured({ access_token: [] })(target, key, {});
            }
        }
    };
};
