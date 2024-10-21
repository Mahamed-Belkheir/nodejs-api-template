import path from "path";
import { Api } from "../api";
import { generateAPIDocs, writeToFile } from "../util/openapi";

(async () => {
    const doc = generateAPIDocs("nodejs-api-template", Api);

    await writeToFile(
        doc,
        path.join(__dirname, "../../openapi/nodejs-api-template.json"),
    );
})();
