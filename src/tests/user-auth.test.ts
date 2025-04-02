import { testFixture, testReq } from "../util/test";

testFixture("user_auth_test", async (tap, honoApp) => {
    const app = testReq(honoApp);

    let token = "";

    await tap.test("can signup", async (t) => {
        const result = await app.post("/api/auth/sign-up/email", {
            email: "user2@gmail.com",
            name: "user name",
            password: "password1234567",
        });

        t.match(result.status, 200);
        t.ok(
            result.headers
                .getSetCookie()
                .pop()
                ?.startsWith("better-auth.session_token="),
        );
    });

    await tap.test("can signin", async (t) => {
        const result = await app.post("/api/auth/sign-in/email", {
            email: "user2@gmail.com",
            password: "password1234567",
        });

        t.match(typeof (await result.json()).token, "string");

        token = result.headers.getSetCookie().pop()!;
    });

    await tap.test("can fetch profile", async (t) => {
        const result = await (
            await app.get("/api/user/me", {
                ["Cookie"]: token,
            })
        ).json();

        t.match(result.status, "success");
        t.match(typeof result.data.id, "string");
        t.match(result.data.name, "user name");
        t.match(result.data.email, "user2@gmail.com");
        t.match(result.data.password, undefined);
    });
});
