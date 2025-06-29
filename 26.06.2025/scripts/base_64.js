class TextCoderUtil {
    static #utf8Encoder = new TextEncoder();
    static #utf8Decoder = new TextDecoder();

    encodeText(input) {
        const bytes = TextCoderUtil.#utf8Encoder.encode(input);
        return btoa(String.fromCharCode(...bytes));
    }

    decodeText(encoded) {
        const binary = atob(encoded);
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        return TextCoderUtil.#utf8Decoder.decode(bytes);
    }

    encodeForUrl(input) {
        return this.encodeText(input)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    decodeFromUrl(encodedUrl) {
        const base64 = encodedUrl
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return this.decodeText(base64);
    }

    buildJwtBody(headerObj, payloadObj) {
        const encodedHeader = this.encodeForUrl(JSON.stringify(headerObj));
        const encodedPayload = this.encodeForUrl(JSON.stringify(payloadObj));
        return `${encodedHeader}.${encodedPayload}`;
    }

    extractJwtPayload(token) {
        const parts = token.split('.');
        if (parts.length < 2) {
            throw new Error("Неправильний формат JWT");
        }
        return JSON.parse(this.decodeFromUrl(parts[1]));
    }

    createBasicToken(login, secret) {
        if (login.includes(':')) {
            throw new Error("Ім'я не може містити ':'");
        }
        return this.encodeText(`${login}:${secret}`);
    }

    readBasicToken(encodedToken) {
        const raw = this.decodeText(encodedToken);
        const delimiter = raw.indexOf(':');

        if (delimiter === -1) {
            throw new Error("Недійсний токен — пропущено ':'");
        }

        return {
            login: raw.slice(0, delimiter),
            secret: raw.slice(delimiter + 1)
        };
    }

    formatAuthHeader(user, pwd) {
        return `Basic ${this.createBasicToken(user, pwd)}`;
    }

    parseAuthHeader(authHeader) {
        if (!authHeader.startsWith('Basic ')) {
            throw new Error("Заголовок не є Basic типу");
        }
        const token = authHeader.slice(6);
        return this.readBasicToken(token);
    }
}
