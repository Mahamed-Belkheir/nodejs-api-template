import { inject } from "tsyringe";
import { ClientError } from "../errors";
import { TransactionManager } from "./trx";

export abstract class BaseRepository<T> {
    constructor(
        @inject(TransactionManager) protected trx: TransactionManager,
    ) {}

    protected abstract tableName: string;
    protected abstract entityName: string;

    protected q(query?: Partial<T> | Partial<T>[]) {
        const trx = this.trx.get();
        let kq = this.trx.knex(this.tableName);
        if (trx) {
            kq.transacting(trx);
        }
        if (query) {
            if (Array.isArray(query)) {
                for (const qr of query) {
                    kq = kq.orWhere(qr);
                }
            } else {
                kq.where(query);
            }
        }

        return kq;
    }

    async insertOne(data: Partial<T>): Promise<T> {
        return (await this.q().insert(data).returning("*"))[0];
    }

    async upsertMany(
        data: Partial<T>[],
        conflictKey: keyof T | (keyof T)[],
    ): Promise<T[]> {
        return this.q()
            .insert(data)
            .onConflict(conflictKey as string)
            .merge()
            .returning("*");
    }

    async insertMany(data: Partial<T>[]): Promise<T[]> {
        return this.q().insert(data).returning("*");
    }

    async findOne(query: Partial<T> | Partial<T>[]): Promise<T | undefined> {
        return this.q(query).first();
    }

    async findOneOrFail(query: Partial<T> | Partial<T>[]): Promise<T> {
        const result = await this.findOne(query);
        if (!result) {
            throw new ClientError(`${this.entityName} not found`, 404);
        }
        return result;
    }

    async find(query: Partial<T> | Partial<T>[]): Promise<T[]> {
        return this.q(query);
    }

    async update(
        query: Partial<T> | Partial<T>[],
        data: Partial<T>,
    ): Promise<number> {
        const num = await this.q(query).update(data);
        return num;
    }

    async updateOrFail(
        query: Partial<T> | Partial<T>[],
        data: Partial<T>,
    ): Promise<void> {
        const n = await this.update(query, data);
        if (n < 1) {
            throw new ClientError(`${this.entityName} not found`, 404);
        }
    }

    async delete(query: Partial<T> | Partial<T>[]): Promise<number> {
        const num = await this.q(query).delete();
        return num;
    }

    async deleteOrFail(query: Partial<T> | Partial<T>[]): Promise<void> {
        const n = await this.delete(query);
        if (n < 1) {
            throw new ClientError(`${this.entityName} not found`, 404);
        }
    }
}
