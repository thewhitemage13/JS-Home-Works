const encoder = new TextCoderUtil();

QUnit.module('TextCoderUtil — Тестування функцій кодування', () => {

    QUnit.test('Звичайне кодування Base64', assert => {
        assert.equal(encoder.encodeText('Петрику'), '0J/QtdGC0YDQuNC60YM=');
        assert.equal(encoder.encodeText('Мій логін є: !@#$%^&*продт'), '0JzRltC5INC70L7Qs9GW0L0g0ZQ6ICFAIyQlXiYq0L/RgNC+0LTRgg==');
        assert.equal(encoder.encodeText(''), '');
    });

    QUnit.test('Декодування звичайного Base64', assert => {
        assert.equal(encoder.decodeText('8J+QlPCfpZo'), '🐔🥚');
        assert.equal(encoder.decodeText(''), '');
    });

    QUnit.test('Кодування у форматі URL', assert => {
        assert.equal(encoder.encodeForUrl('Петрику'), '0J_QtdGC0YDQuNC60YM');
        assert.equal(encoder.encodeForUrl('Мій логін є: !@#$%^&*продт'), '0JzRltC5INC70L7Qs9GW0L0g0ZQ6ICFAIyQlXiYq0L_RgNC-0LTRgg');
        assert.equal(encoder.encodeForUrl(''), '');
    });

    QUnit.test('Декодування з URL формату', assert => {
        assert.equal(encoder.decodeFromUrl('8J-QlPCfpZo'), '🐔🥚');
        assert.equal(encoder.decodeFromUrl(''), '');
    });

    QUnit.test('JWT: розбір даних', assert => {
        const validJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBenVyZVB2MzExIiwic3ViIjoiMzJkMGY2MDItOGZmZS00NmM2LWEwZDItYzU5ZGY1ZDllZDQ1IiwiYXVkIjoiU2VsZlJlZ2lzdGVyZWQiLCJpYXQiOjE3NTA3NzcyODIzLCJleHAiOjE3NTA3NzczMTIzLCJuaWQiOiJqYyIsIm5hbSI6ItCf0LXRgNGC0LjQutGDINCfJ9GP0YLQvtGH0LrRltC9In0.86eAgeEcQBQGsoBj4ubFoFTINLDEt4UEK9R4k0A5pjY";
        const payload = encoder.extractJwtPayload(validJWT);
        assert.equal(payload.nam, "Пертику П'яточкін");

        const brokenJWT = validJWT.replace('.', '/.');
        assert.throws(() => encoder.extractJwtPayload(brokenJWT), "Повинна бути помилка при неправильному JWT");
    });

    QUnit.test('JWT: формування', assert => {
        const head = { alg: "HS256", typ: "JWT" };
        const body = { loggedInAs: "admin", iat: 1422779638 };
        const jwt = encoder.buildJwtBody(head, body);
        assert.equal(jwt, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9");
    });

    QUnit.test('AuthToken: базове кодування', assert => {
        const token = encoder.createBasicToken("testUser", "testPass123");
        assert.equal(token, "dGVzdFVzZXI6dGVzdFBhc3MxMjM=");
    });

    QUnit.test('AuthToken: мої персональні дані', assert => {
        const encoded = encoder.createBasicToken("Yusypiv Olexandr", "SecureP@ss2023!");
        assert.equal(encoded, "WXVzeXBpdiBPbGV4YW5kcjpTZWN1cmVQQHNzMjAyMyE=");

        const parsed = encoder.readBasicToken(encoded);
        assert.equal(parsed.login, "Yusypiv Olexandr");
        assert.equal(parsed.secret, "SecureP@ss2023!");
    });

});
