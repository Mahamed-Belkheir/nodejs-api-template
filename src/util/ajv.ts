import Ajv from "ajv";
import formats from "ajv-formats";

export const ajv = new Ajv({
    coerceTypes: true,
    removeAdditional: "all",
    useDefaults: "empty",
});

formats(ajv);
