import createHttpError from "http-errors";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import { Session } from "../models/Session.js";
import crypto from 'node:crypto';
import { sendMail } from "../utils/sendMail.js";


export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });
    if (user !== null) {
        throw new createHttpError.Conflict('Email already in use')
    }

    payload.password = await bcrypt.hash(payload.password, 10)
    return User.create(payload);
}

export async function loginUser(email, password) {
    const user = await User.findOne({
        email : email,
    });
    
    if (user === null) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match !== true) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }

    await Session.deleteOne({userId: user._id})

    const accessToken = crypto.randomBytes(30).toString('base64');

    const refreshToken = crypto.randomBytes(30).toString('base64');


    return Session.create({
        userId:user._id ,
        accessToken,
        refreshToken,
        accessTokenValidUntil:new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil:new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
}



export async function logoutUser(sessionId, refreshToken) {
   await Session.deleteOne({_id : sessionId, refreshToken})
}

export async function refreshUser(sessionId, refreshToken) {
    const session = await Session.findOne({ _id: sessionId });
    if (session === null) {
        throw new createHttpError.Unauthorized('session not found');
    }

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('refresh token is invalid');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('refresh token is expired');

    }

    await Session.deleteOne({ _id: session._id })
    

     return Session.create({
        userId: session.userId,
        accessToken:crypto.randomBytes(30).toString('base64'),
        refreshToken:crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil:new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil:new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
}

export async function resetEmailUser(email) {
    const user = await User.findOne({ email })
    if (user === null) {
        throw new createHttpError.Unauthorized('User not found');
    }

    await sendMail(
        user.email,
        'reset password',
        `<p>To reset password follow this <a href=''>link</a></p>`,
    );
}