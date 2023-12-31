import { Request, Response, NextFunction } from 'express';

import { getCurrentUserFromRequest } from './Auth';
import { ForbiddenError } from '../utils/response';

type RoleType = 'Personal';

export default function Role(roleType: RoleType[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        let checked = false;
        for (const role of roleType) {
            switch (role) {
                case 'Personal': {
                    const jwtInfo = getCurrentUserFromRequest(req);
                    if (jwtInfo.uid !== req.params.uid) {
                        throw new ForbiddenError();
                    }
                    checked = true;
                    break;
                }
            }
        }

        next();
    };
}
