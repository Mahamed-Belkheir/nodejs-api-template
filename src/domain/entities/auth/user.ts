import { Entity, type Opt, Property, Unique } from "@mikro-orm/core";
import type { User as DatabaseUser } from "better-auth";

import { Base } from "./base";

@Entity()
export class User extends Base implements DatabaseUser {
    @Property({ type: "string" })
    @Unique()
    email!: string;

    @Property({ type: "boolean" })
    emailVerified: Opt<boolean> = false;

    @Property({ type: "string" })
    name!: string;

    @Property({ type: "string", nullable: true })
    image?: string;
}
