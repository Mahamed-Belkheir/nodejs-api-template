import { AsyncLocalStorage } from "async_hooks";
import { Knex } from "knex";
import { inject, singleton } from "tsyringe";
import { KnexRef } from "./";

/**
 * Used by repositories to find running transactions, and allows usecases and domain services to start transactions
 */
@singleton()
export class TransactionManager {
    private trxStore: AsyncLocalStorage<Knex.Transaction>;
    public knex: Knex;

    constructor(@inject(KnexRef) knex: Knex) {
        this.knex = knex;
        this.trxStore = new AsyncLocalStorage<Knex.Transaction>();
    }

    public get() {
        return this.trxStore.getStore();
    }

    private async startTransaction<T>(
        cb: () => T | Promise<T>,
        isolationLevel: Knex.IsolationLevels,
        trx?: Knex.Transaction,
    ): Promise<T> {
        if (!trx) {
            const existingTrx = this.get();
            if (existingTrx && !existingTrx.isCompleted()) {
                trx = await existingTrx.transaction();
            } else {
                trx = await this.knex.transaction({ isolationLevel });
            }
        } else {
            trx = await trx.transaction();
        }
        try {
            const result = await this.trxStore.run(trx, () => cb());
            await trx.commit();
            return result;
        } catch (e) {
            await trx.rollback();
            //@ts-expect-error hopefully no one is throwing primatives
            if (e["code"] === "40001") {
                return this.startTransaction(cb, isolationLevel, undefined);
            }
            throw e;
        }
    }

    public async start<T>(cb: () => T | Promise<T>, trx?: Knex.Transaction) {
        return this.startTransaction(cb, "repeatable read", trx);
    }

    public async startSerializable<T>(
        cb: () => T | Promise<T>,
        trx?: Knex.Transaction,
    ) {
        return this.startTransaction(cb, "serializable", trx);
    }
}
