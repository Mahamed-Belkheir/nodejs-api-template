import { MikroORM } from "@mikro-orm/postgresql";
import config from "./config";

export function configureMikro() {
    return MikroORM.init({
        ...config,
    });
}
