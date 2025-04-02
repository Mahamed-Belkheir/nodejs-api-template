import { Context as Ctx, Get, Http } from "@dikur/http";
import { Context } from "hono";
import { inject, singleton } from "tsyringe";
import { TUser } from "../../schemas/user";
import { res } from "../../util/response";
import { UserProfileUC } from "../../usecases/auth/user";
import { JSONResponse } from "../../util/openapi";
import { authUser } from "../../auth";

@singleton()
@Http("/user")
export class UserController {
    constructor(@inject(UserProfileUC) private uc: UserProfileUC) {}

    @JSONResponse.ok.data(TUser)
    @authUser()
    @Get("/me")
    async me(@Ctx() ctx: Context) {
        const user = await this.uc.getMe();
        return res(ctx).ok.data(JSON.parse(JSON.stringify(user)), TUser);
    }
}
