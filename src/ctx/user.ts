import { AsyncLocalStorage } from "async_hooks";
import { TUser } from "../schemas/user";
import { singleton } from "tsyringe";
import { ServerError } from "../errors";

@singleton()
export class UserContext {
    private store = new AsyncLocalStorage<TUser>();
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

    public start<T>(data: TUser, cb: () => T | Promise<T>) {
        return this.store.run(data, cb);
    }
}
