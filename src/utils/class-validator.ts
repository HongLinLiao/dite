import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request } from 'express';

import { BadRequestError } from './response';

export async function validBody(type: ClassConstructor<object>, req: Request) {
    const invalids = await validate(plainToClass(type, req.body));
    if (invalids.length) {
        throw new BadRequestError(concatError(invalids));
    }
}

function concatError(validateErrors: ValidationError[]) {
    const error = Array<string>();
    for (const errorItem of validateErrors) {
        if (!errorItem.constraints) continue;
        for (const errorMsg of Object.values(errorItem.constraints)) {
            error.push(errorMsg);
        }
    }

    return error.join('\n');
}
