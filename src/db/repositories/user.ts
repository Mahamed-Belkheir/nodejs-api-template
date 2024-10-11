import { singleton } from "tsyringe";
import { TUser } from "../../entities/user";
import { BaseRepository } from "../repository";

@singleton()
export class UserRepository extends BaseRepository<TUser> {
    protected tableName: string = "users";
    protected entityName: string = "User";
}
