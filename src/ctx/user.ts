import { AsyncLocalStorage } from "async_hooks";
import { TUserAuthenticated } from "../entities/user";
import { container, singleton } from "tsyringe";
import { ServerError } from "../errors";
import { Context, Next } from "hono";
import { AUTH_HEADER, authService } from "../auth/qufl";

@singleton()
export class UserContext {
    private store = new AsyncLocalStorage<TUserAuthenticated>();
    get() {
        const user = this.getOptional();
        if (!user) {
            throw new ServerError(
                "attempted to access current user without authentication",
            );
        }
        return user;
    }
    getOptional() {
        return this.store.getStore();
    }

    public start<T>(data: TUserAuthenticated, cb: () => T | Promise<T>) {
        return this.store.run(data, cb);
    }
}

export async function setupUserContext(ctx: Context, next: Next) {
    const token = ctx.req.header(AUTH_HEADER);
    if (!token) {
        return next();
    }
    try {
        const user = await authService.authenticateToken(token);
        return container.resolve(UserContext).start(user, next);
    } catch {
        return next();
    }
}
