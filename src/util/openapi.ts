import { OpenAPIAdapter, Response } from "@dikur/openapi";
import { AUTH_HEADER } from "../auth/qufl";
import { TSchema, Type } from "@sinclair/typebox";
import { writeFile } from "fs/promises";
import { HttpCode, OpenAPI } from "@dikur/openapi/dist/types";

export function generateAPIDocs(title: string, clz: any) {
    return OpenAPIAdapter(clz, {
        info: {
            title,
            version: "1",
        },
        openapi: "3.1.0",
        components: {
            securitySchemes: {
                access_token: {
                    type: "apiKey",
                    in: "header",
                    name: AUTH_HEADER,
                },
            },
        },
    });
}

export const JSONResponse = {
    ok: {
        msg: <T extends string>(
            message: T,
            code: HttpCode = "200",
            description = "message response",
        ) => {
            return Response(
                code,
                "application/json",
                description,
                Type.Object({
                    status: Type.Literal("success"),
                    message: Type.Literal(message),
                }),
            );
        },
        data: <T extends TSchema>(
            entitySchema: T,
            code: HttpCode = "200",
            description = "data response",
        ) => {
            return Response(
                code,
                "application/json",
                description,
                Type.Object({
                    status: Type.Literal("success"),
                    data: entitySchema,
                }),
            );
        },
    },
    err: {
        msg: <T extends string>(
            message: T,
            code: HttpCode = "400",
            description = "error response",
        ) => {
            return Response(
                code,
                "application/json",
                description,
                Type.Object({
                    status: Type.Literal("error"),
                    message: Type.Literal(message),
                }),
            );
        },
    },
};

export async function writeToFile(doc: OpenAPI, filePath: string) {
    await writeFile(filePath, JSON.stringify(doc, null, 4), {
        flag: "w+",
    });
}
