import { inject, singleton } from "tsyringe";
import { DBContext } from "../../db/ctx";
import {
    TUserAuthenticated,
    TUserSigninRequest,
    TUserSignupRequest,
} from "../../entities/user";
import { ClientError } from "../../errors";
import { hashString, verifyHash } from "../../util/hash";
import { UserContext } from "../../ctx/user";

@singleton()
export class UserAuthenticationUC {
    constructor(
        @inject(UserContext) private userCtx: UserContext,
        @inject(DBContext) private db: DBContext,
    ) {}
    async signup(data: TUserSignupRequest): Promise<TUserAuthenticated> {
        return this.db.trx.start(async () => {
            const alreadyExists = await this.db.users.findOne({
                email: data.email,
            });
            if (alreadyExists) {
                throw new ClientError("email already in user");
            }
            data.password = await hashString(data.password);
            return await this.db.users.insertOne(data);
        });
    }

    async signin(data: TUserSigninRequest): Promise<TUserAuthenticated> {
        const user = await this.db.users.findOne({ email: data.email });
        if (!user || !(await verifyHash(data.password, user.password))) {
            throw new ClientError("incorrect details", 400);
        }
        return user;
    }

    async getMe() {
        const { id } = this.userCtx.get();
        return this.db.users.findOneOrFail({ id });
    }
}
