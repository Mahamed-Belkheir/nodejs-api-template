import { Static, Type } from "@sinclair/typebox";

export const TToken = Type.Object({
    token: Type.String(),
});
export type TToken = Static<typeof TToken>;
