import { StoreFacade } from "qufl/lib/store";
import { OpaqueStrategy } from "qufl/lib/strategies/opaque";
import { TUserAuthenticated } from "../entities/user";
import { JSONResponse } from "../util/openapi";
import { Secured } from "@dikur/openapi";
import { Middleware } from "@dikur/http";
import { Context, Next } from "hono";
import { container } from "tsyringe";
import { UserContext } from "../ctx/user";
import { ClientError } from "../errors";

export const authService = new OpaqueStrategy<TUserAuthenticated>(
    new StoreFacade(),
);

export const AUTH_HEADER = "authentication";

export function authUser() {
    return function (target: any, key?: any) {
        Middleware(async (ctx: Context, next: Next) => {
            const user = container.resolve(UserContext).getOptional();
            if (!user) {
                throw new ClientError("unauthenticated", 401);
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
}
