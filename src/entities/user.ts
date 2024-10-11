import { Static, Type } from "@sinclair/typebox";
import { timestampFields } from "../util/entities";

export const TUser = Type.Object({
    id: Type.String(),
    fullName: Type.String(),
    email: Type.String({ format: "email" }),
    password: Type.String(),
    ...timestampFields,
});
export type TUser = Static<typeof TUser>;

export const TUserSigninRequest = Type.Pick(TUser, ["email", "password"]);
export type TUserSigninRequest = Static<typeof TUserSigninRequest>;

export const TUserSignupRequest = Type.Pick(TUser, [
    "email",
    "password",
    "fullName",
]);
export type TUserSignupRequest = Static<typeof TUserSignupRequest>;

export const TUserAuthenticated = Type.Omit(TUser, ["password"]);
export type TUserAuthenticated = Static<typeof TUserAuthenticated>;
