import { OpaqueStrategy, StoreFacade } from "qufl";
import { TUserAuthenticated } from "../entities/user";

export const authService = new OpaqueStrategy<TUserAuthenticated>(
    new StoreFacade(),
);

export const AUTH_HEADER = "authentication";
