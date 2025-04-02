import { inject, singleton } from "tsyringe";
import { DBContext } from "../../db/ctx";

import { UserContext } from "../../ctx/user";

@singleton()
export class UserProfileUC {
    constructor(
        @inject(UserContext) private userCtx: UserContext,
        @inject(DBContext) private db: DBContext,
    ) {}

    async getMe() {
        const { id } = this.userCtx.get();
        return this.db.users.findOneOrFail({ id });
    }
}
