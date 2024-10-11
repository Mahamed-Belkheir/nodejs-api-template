import { Static, TSchema, Type } from "@sinclair/typebox";
import { Context } from "hono";
import fast from "fast-json-stringify";
import { StatusCode } from "hono/utils/http-status";

const cache = new Map<TSchema, <TDoc>(doc: TDoc) => any>();

function getSerializer(t: TSchema) {
    let s = cache.get(t);
    if (!s) {
        s = fast(
            Type.Object({
                status: Type.String(),
                data: t,
            }),
        );
    }
    return s;
}

export function res(ctx: Context) {
    return {
        ok: {
            msg: (msg: string) => {
                return ctx.json({
                    status: "success",
                    message: msg,
                });
            },
            data: <S extends TSchema, V extends Static<S>>(
                data: V,
                schema: S,
                status: StatusCode = 200,
            ) => {
                const v = getSerializer(schema);
                ctx.header("Content-Type", "application/json");
                ctx.status(status);
                return ctx.body(
                    v({
                        status: "success",
                        data,
                    }),
                );
            },
        },
        err: {
            msg: (msg: string, status: StatusCode = 400) => {
                ctx.status(status);
                return ctx.json({
                    status: "error",
                    message: msg,
                });
            },
        },
    };
}
