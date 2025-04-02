import "reflect-metadata";
import { Hono } from "hono";
import tap from "tap";
import { Test } from "tap/dist/commonjs/main";
import { container } from "tsyringe";
import { configureMikro } from "../db";
import { CreateAPI } from "../api";
import { MikroORM } from "@mikro-orm/postgresql";
import { Configuration } from "../config";
import config from "../db/config";

export function testFixture(
    name: string,
    cb: (t: Test, honoApi: Hono) => Promise<void>,
) {
    let mikroORM: MikroORM;

    tap.before(async () => {
        config.dbName = name;
        mikroORM = await configureMikro(config);
        container.register(MikroORM, { useValue: mikroORM });
        await mikroORM.schema.dropDatabase();
        await mikroORM.schema.ensureDatabase();
        await mikroORM.migrator.up();
    });

    tap.teardown(async () => {
        mikroORM.close();
    });
    return tap.test(name, async (t) => {
        try {
            await cb(t, CreateAPI(container));
        } catch (e) {
            console.error("error thrown in test:", e);
        }
    });
}

export function testReq(
    app: Hono,
    defaultHeaders: Record<string, string> = {},
) {
    async function doRequest(
        path: string,
        method: string,
        headers: Record<string, string> = {},
        body?: any,
    ) {
        headers = Object.assign(
            { ...defaultHeaders, Host: Configuration.server.basePath },
            headers,
        );
        if (body) {
            body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
        }
        const result = await app.request(path, {
            method,
            body,
            headers,
        });
        try {
            return result;
        } catch {
            throw new Error(`Got error parsing json: ` + (await result.text()));
        }
    }

    return {
        get(path: string, headers?: Record<string, string>) {
            return doRequest(path, "GET", headers);
        },
        post(path: string, body?: any, headers?: Record<string, string>) {
            return doRequest(path, "POST", headers, body);
        },
        patch(path: string, body?: any, headers?: Record<string, string>) {
            return doRequest(path, "PATCH", headers, body);
        },
        Put(path: string, body?: any, headers?: Record<string, string>) {
            return doRequest(path, "PUT", headers, body);
        },
        del(path: string, headers?: Record<string, string>) {
            return doRequest(path, "DELETE", headers);
        },
    };
}
