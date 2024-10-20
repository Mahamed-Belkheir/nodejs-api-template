import { AUTH_HEADER } from "../auth/qufl";
import { TUserSignupRequest } from "../entities/user";
import { testFixture, testReq } from "../util/test";

testFixture("user_auth_test", async (tap, honoApp) => {
    const app = testReq(honoApp);

    await tap.test("can signup", async (t) => {
        const result = await app.post("/api/auth/user/signup", {
            email: "user@email.com",
            fullName: "user name",
            password: "password",
        } as TUserSignupRequest);

        t.match(result.status, "success");
        t.match(typeof result.data.token, "string");
    });

    let token: string = "";

    await tap.test("can signin", async (t) => {
        const result = await app.post("/api/auth/user/signin", {
            email: "user@email.com",
            password: "password",
        } as TUserSignupRequest);

        t.match(result.status, "success");
        t.match(typeof result.data.token, "string");

        token = result.data.token;
    });

    await tap.test("can fetch profile", async (t) => {
        const result = await app.get("/api/auth/user/me", {
            [AUTH_HEADER]: token,
        });

        t.match(result.status, "success");
        t.match(typeof result.data.id, "string");
        t.match(result.data.fullName, "user name");
        t.match(result.data.email, "user@email.com");
        t.match(result.data.password, undefined);
    });
});
