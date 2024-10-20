import { StoreFacade } from "qufl/lib/store";
import { OpaqueStrategy } from "qufl/lib/strategies/opaque";
import { TUserAuthenticated } from "../entities/user";

export const authService = new OpaqueStrategy<TUserAuthenticated>(
    new StoreFacade(),
);

export const AUTH_HEADER = "authentication";
