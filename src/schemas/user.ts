import { Static, Type } from "@sinclair/typebox";
import { timestampFields } from "../util/entities";

export const TUser = Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String({ format: "email" }),
    emailVerified: Type.Boolean(),
    image: Type.Optional(Type.String()),
    ...timestampFields,
});
export type TUser = Static<typeof TUser>;
