import { Type } from "@sinclair/typebox";

export const TDate = Type.Unsafe<Date>({ type: "string", format: "date-time" });

export const timestampFields = {
    createdAt: TDate,
    updatedAt: TDate,
};
