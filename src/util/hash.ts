import { hash, verify } from "argon2";
import { randomBytes } from "crypto";

export async function hashString(plainText: string) {
    return hash(plainText);
}

export async function verifyHash(plainText: string, hash: string) {
    return verify(hash, plainText);
}

export async function randomHash(length = 8) {
    return randomBytes(length).toString("hex");
}
