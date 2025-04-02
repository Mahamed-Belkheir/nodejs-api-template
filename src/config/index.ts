const env = process.env;

export const Configuration = {
    server: {
        name: env.APP_NAME || "nodejs-api-template",
        env: env.NODE_ENV || "development",
        logLevel: env.LOG_LEVEL || "info",
        port: (() => {
            let port = Number(env.PORT);
            if (Number.isNaN(port)) {
                port = 8008;
            }
            return port;
        })(),
        basePath: env.DOMAIN || "localhost:8008",
    },
    db: {
        host: env.DB_HOST || "localhost",
        database: env.DB_NAME || "nodejs_api_template_db",
        user: env.DB_USERNAME || "postgres",
        password: env.DB_PASSWORD || "postgres",
    },
};
