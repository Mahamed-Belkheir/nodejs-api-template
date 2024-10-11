import { Body, Context as Ctx, Get, Http, Post } from "@dikur/http";
import { Context } from "hono";
import { inject, singleton } from "tsyringe";
import {
    TUserAuthenticated,
    TUserSigninRequest,
    TUserSignupRequest,
} from "../../entities/user";
import { res } from "../../util/response";
import { UserAuthenticationUC } from "../../usecases/auth/user";
import { AUTH_HEADER, authService } from "../../auth/qufl";
import { TToken } from "../../util/type";
import { ClientError } from "../../errors";

@singleton()
@Http("/user")
export class UserAuthController {
    constructor(
        @inject(UserAuthenticationUC) private uc: UserAuthenticationUC,
    ) {}

    @Post("/signin")
    async signin(
        @Ctx() ctx: Context,
        @Body(TUserSigninRequest) data: TUserSigninRequest,
    ) {
        const user = await this.uc.signin(data);
        const token = await authService.issueToken(user);
        return res(ctx).ok.data({ token }, TToken);
    }

    @Post("/signup")
    async signup(
        @Ctx() ctx: Context,
        @Body(TUserSignupRequest) data: TUserSignupRequest,
    ) {
        const user = await this.uc.signup(data);
        const token = await authService.issueToken(user);
        return res(ctx).ok.data({ token }, TToken);
    }

    @Get("/me")
    async me(@Ctx() ctx: Context) {
        const token = ctx.req.header(AUTH_HEADER);
        if (!token) {
            throw new ClientError("unauthenticated", 401);
        }
        const { id } = await authService.authenticateToken(token);
        const user = await this.uc.getMe(id);
        return res(ctx).ok.data(user, TUserAuthenticated);
    }
}