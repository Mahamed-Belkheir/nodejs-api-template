import { Http, NestedRouter } from "@dikur/http";
import { singleton } from "tsyringe";
import { UserAuthController } from "./user";

@singleton()
@Http("/auth")
export class AuthController {
    @NestedRouter()
    static user = UserAuthController;
}
