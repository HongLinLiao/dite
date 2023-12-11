import mongoose from 'mongoose';

import env from './env';

type Session = mongoose.mongo.ClientSession;

export function initMongoDB() {
    const db = mongoose.connect(env.mongoConnection);

    db.then(() => {
        console.log('🚀 MongoDB connect success!');
    });

    db.catch(() => {
        console.log('❌ MongoDB connect failed!');
    });
}

export function addIdField(schema: mongoose.Schema) {
    schema.virtual('id').get(function () {
        return this._id;
    });
}

export async function createSession() {
    const session = await mongoose.startSession();
    const transactions: ((session: Session) => Promise<unknown>)[] = [];

    const startSession = async () => {
        try {
            session.startTransaction();
            await Promise.all(transactions.map((transaction) => transaction(session)));
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }
    };

    const addTransaction = (transaction: (session: Session) => Promise<unknown>) => {
        transactions.push(transaction);
    };

    const concatTransaction = <T>(preTrans: (session: Session) => Promise<T>, nextTrans: (data: T) => (session: Session) => Promise<unknown>) => {
        return async (session: Session) => {
            return await preTrans(session).then(async (data: T) => await nextTrans(data)(session));
        };
    };

    return {
        startSession,
        addTransaction,
        concatTransaction,
    };
}
