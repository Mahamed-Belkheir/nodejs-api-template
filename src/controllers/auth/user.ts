import { Body, Context as Ctx, Get, Http, Post } from "@dikur/http";
import { Context } from "hono";
import { inject, singleton } from "tsyringe";
import {
    TUserAuthenticated,
    TUserSigninRequest,
    TUserSignupRequest,
} from "../../schemas/user";
import { res } from "../../util/response";
import { UserAuthenticationUC } from "../../usecases/auth/user";
import { authService, authUser } from "../../auth/qufl";
import { TToken } from "../../util/type";
import { JSONResponse } from "../../util/openapi";

@singleton()
@Http("/user")
export class UserAuthController {
    constructor(
        @inject(UserAuthenticationUC) private uc: UserAuthenticationUC,
    ) {}

    @JSONResponse.ok.data(TToken)
    @Post("/signin")
    async signin(
        @Ctx() ctx: Context,
        @Body(TUserSigninRequest) data: TUserSigninRequest,
    ) {
        const user = await this.uc.signin(data);
        const token = await authService.issueToken(user);
        return res(ctx).ok.data({ token }, TToken);
    }

    @JSONResponse.ok.data(TToken)
    @Post("/signup")
    async signup(
        @Ctx() ctx: Context,
        @Body(TUserSignupRequest) data: TUserSignupRequest,
    ) {
        const user = await this.uc.signup(data);
        const token = await authService.issueToken(user);
        return res(ctx).ok.data({ token }, TToken);
    }

    @JSONResponse.ok.data(TUserAuthenticated)
    @authUser()
    @Get("/me")
    async me(@Ctx() ctx: Context) {
        const user = await this.uc.getMe();
        return res(ctx).ok.data(user, TUserAuthenticated);
    }
}
