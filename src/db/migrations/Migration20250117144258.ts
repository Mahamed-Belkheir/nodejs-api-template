import { Migration } from "@mikro-orm/migrations";

export class Migration20250117144258 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "user" ("id" varchar(255) not null, "fullName" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "createdAt" varchar(255) not null, "updatedAt" varchar(255) not null, constraint "user_pkey" primary key ("id"));`,
        );
    }
}
