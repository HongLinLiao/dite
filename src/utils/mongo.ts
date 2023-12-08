import mongoose from 'mongoose';

import env from './env';

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
