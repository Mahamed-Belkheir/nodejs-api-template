import { inject, singleton } from "tsyringe";
import { TransactionManager } from "./trx";
import { UserRepository } from "./repositories/user";

@singleton()
export class DBContext {
    constructor(
        @inject(UserRepository) public users: UserRepository,
        @inject(TransactionManager) public trx: TransactionManager,
    ) {}
}
