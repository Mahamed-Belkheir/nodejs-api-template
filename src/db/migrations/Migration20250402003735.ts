import { Migration } from "@mikro-orm/migrations";

export class Migration20250402003735 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "account" ("id" varchar(255) not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "providerId" varchar(255) not null, "accessToken" varchar(255) null, "accountId" varchar(255) not null, "userId" varchar(255) not null, "refreshToken" varchar(255) null, "accessTokenExpiresAt" timestamptz null, "refreshTokenExpiresAt" timestamptz null, "scope" varchar(255) null, "idToken" varchar(255) null, "password" varchar(255) null, constraint "account_pkey" primary key ("id"));`,
        );

        this.addSql(
            `create table "Session" ("id" varchar(255) not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "token" varchar(255) not null, "expiresAt" timestamptz not null, "ipAddress" varchar(255) null, "userAgent" varchar(255) null, "userId" varchar(255) not null, constraint "Session_pkey" primary key ("id"));`,
        );
        this.addSql(
            `alter table "Session" add constraint "Session_token_unique" unique ("token");`,
        );

        this.addSql(
            `create table "User" ("id" varchar(255) not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "email" varchar(255) not null, "emailVerified" boolean not null default false, "name" varchar(255) not null, "image" varchar(255) null, constraint "User_pkey" primary key ("id"));`,
        );
        this.addSql(
            `alter table "User" add constraint "User_email_unique" unique ("email");`,
        );

        this.addSql(
            `create table "verification" ("id" varchar(255) not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "identifier" varchar(255) not null, "value" varchar(255) not null, "expiresAt" timestamptz not null, constraint "verification_pkey" primary key ("id"));`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "account" cascade;`);

        this.addSql(`drop table if exists "Session" cascade;`);

        this.addSql(`drop table if exists "User" cascade;`);

        this.addSql(`drop table if exists "verification" cascade;`);
    }
}
