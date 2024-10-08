const env = process.env;

export const Configuration = {
    db: {
        host: env.DB_HOST || "localhost",
        database: env.DB_NAME || "ecommerce",
        user: env.DB_USERNAME || "user",
        password: env.DB_PASSWORD || "password",
    },
};
