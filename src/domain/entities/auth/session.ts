import { Entity, Property, Unique } from "@mikro-orm/core";
import type { Session as DatabaseSession } from "better-auth";

import { Base } from "./base";

@Entity()
export class Session extends Base implements Omit<DatabaseSession, "userId"> {
    @Property({ type: "string" })
    @Unique()
    token!: string;

    @Property({ type: Date })
    expiresAt!: Date;

    @Property({ type: "string", nullable: true, default: null })
    ipAddress?: string | null | undefined;

    @Property({ type: "string", nullable: true, default: null })
    userAgent?: string | null | undefined;

    @Property()
    userId!: string;
}
