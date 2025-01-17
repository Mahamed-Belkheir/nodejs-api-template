import { inject, singleton } from "tsyringe";
import { EntityRepository, MikroORM } from "@mikro-orm/postgresql";
import { User } from "../domain/entities/user";

@singleton()
export class DBContext {
    public users: EntityRepository<User>;
    public em: MikroORM["em"];
    constructor(@inject(MikroORM) orm: MikroORM) {
        console.log("created DB Context", orm.em);
        this.users = orm.em.getRepository(User);
        this.em = orm.em;
    }
}
