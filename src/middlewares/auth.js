import createHttpError from "http-errors";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
export async function auth(req, res, next) {

    const { authorization } = req.headers;

    if (typeof authorization !== 'string') {
       return next(new createHttpError.Unauthorized('provide access tokeen'));

    }

    const [bearer, accessToken] = authorization.split(' ', 2);


    if (bearer !== 'Bearer' || typeof accessToken !== "string") {
        return next(new createHttpError.Unauthorized('provide access tokeen'));
    }

    const session = await Session.findOne({ accessToken });
    console.log(session)
    if (session === null) {
        return next(new createHttpError.Unauthorized('Session is not found '));


    }

    if (session.accessTokenValidUntil < new Date()) {
       return next(new createHttpError.Unauthorized('Access token is expired')); 
    }

    const user = await User.findOne({_id: session.userId})

    if (user === null) {
        return next(new createHttpError.Unauthorized('User not found'));
    }

    req.user = {
        id: user._id,
        name: user.name,
    }
    next()
}
