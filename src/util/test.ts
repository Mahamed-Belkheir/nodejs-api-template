import "reflect-metadata";
import { Hono } from "hono";
import tap from "tap";
import { Test } from "tap/dist/commonjs/main";
import { container } from "tsyringe";
import { knexConfig, KnexRef } from "../db";
import Knex from "knex";
import { CreateAPI } from "../api";

export function testFixture(
    name: string,
    cb: (t: Test, honoApi: Hono) => Promise<void>,
) {
    const testConfig = structuredClone(knexConfig);
    testConfig.connection.database = name;
    const testKnex = Knex({ ...structuredClone(testConfig) });
    const baseKnex = Knex({ ...structuredClone(knexConfig) });
    container.register(KnexRef, { useValue: testKnex });

    tap.before(async () => {
        await baseKnex.raw("DROP DATABASE IF EXISTS ??", name);
        await baseKnex.raw("CREATE DATABASE ??", name);
        await testKnex.migrate.latest();
    });

    tap.teardown(async () => {
        testKnex.destroy();
        baseKnex.destroy();
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
        headers = Object.assign({ ...defaultHeaders }, headers);
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
            return await result.json();
        } catch {
            throw new Error("Got error parsing json: " + result.text);
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
