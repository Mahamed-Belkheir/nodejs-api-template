import pino, { Logger as PinoLogger } from "pino";
import { Configuration } from "../config";
import { singleton } from "tsyringe";

@singleton()
export class BaseLogger {
    protected baseLogger: PinoLogger;

    constructor() {
        const targets = [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
        ];

        // Add another transport
        // if (!['development', 'test'].includes(Configuration.server.env)) {

        // }

        const level = Configuration.server.logLevel;
        this.baseLogger = pino(
            {
                level,
            },
            pino.transport({ targets }),
        );

        this.baseLogger.setBindings({
            app: Configuration.server.name,
            env: Configuration.server.env,
        });
    }

    protected get logger() {
        return this.baseLogger;
    }

    /**
     * For use with debugging every step in the codebase
     * @param obj
     * @param msg
     */
    public trace(obj: unknown, msg?: string) {
        this.logger.trace(obj, msg);
    }
    /**
     * For use with general debugging information
     * @param obj
     * @param msg
     */
    public debug(obj: unknown, msg?: string) {
        this.logger.debug(obj, msg);
    }
    /**
     * General logging information
     * @param obj
     * @param msg
     */
    public info(obj: unknown, msg?: string) {
        this.logger.info(obj, msg);
    }
    /**
     * Warnings that need to be taken a look at but not fatal
     * @param obj
     * @param msg
     */
    public warn(obj: unknown, msg?: string) {
        this.logger.warn(obj, msg);
    }
    /**
     * Errors in the system, not errors for the user
     * @param obj
     * @param msg
     */
    public error(obj: unknown, msg?: string) {
        this.logger.error(obj, msg);
    }
    /**
     * Logging errors that cause the server to die
     * @param obj
     * @param msg
     */
    public fatal(obj: unknown, msg?: string) {
        this.logger.fatal(obj, msg);
    }
}
