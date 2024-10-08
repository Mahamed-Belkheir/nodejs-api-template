export class ClientError extends Error {
    constructor(
        public message: string,
        public httpCode = 400,
    ) {
        super();
    }
}

export class ServerError extends Error {
    public httpCode = 500;
    constructor(
        public message: string,
        public cause?: Error,
    ) {
        super();
    }
}
