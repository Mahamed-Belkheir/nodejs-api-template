import { MikroORM, Options } from "@mikro-orm/postgresql";

export function configureMikro(config: Options) {
    return MikroORM.init({
        ...config,
    });
}
