import e from "express"
import { ResponseWithUser } from "../ts/types";


class UsersController {
    async handleGetUser(_: e.Request, res: ResponseWithUser){
        return res.locals.user;
    }
}

export default new UsersController();
