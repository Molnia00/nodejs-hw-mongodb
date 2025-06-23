import * as fs from 'node:fs';
import path from 'node:path';
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import { Session } from "../models/Session.js";
import crypto from 'node:crypto';
import { sendMail } from "../utils/sendMail.js";
import { Types } from "mongoose";
import Handlebars from "handlebars";
import jwt from 'jsonwebtoken';
import {getEnvVar} from '../utils/getEnvVar.js'




const RESET_PASSWORD_TEMLTE = fs.readFileSync(path.resolve('src', "templates", "reset-password.hbs"), "UTF-8");
console.log(RESET_PASSWORD_TEMLTE)

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



export async function logoutUser(sessionId) {
    if (!Types.ObjectId.isValid(sessionId)) {
        console.error("Invalid sessionId provided for logout:", sessionId);
        throw new createHttpError.Unauthorized('Invalid session ID format');
    }
   await Session.deleteOne({_id : sessionId})
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

    const template = Handlebars.compile(RESET_PASSWORD_TEMLTE);
    const token = jwt.sign({
        sub: user._id,
        name: user.name
    }, getEnvVar('JWT_SECRET'),{
        expiresIn: "5m"
       });

    await sendMail(
        user.email,
        'reset password',
        template({link:`http://localhost:3000/reset-password?token=${token}`}),
    );
}

export const resetPassword = async (password, token ) => {
    
    try {

        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
        console.log(decoded);

        const user =await User.findOne({ _id: decoded.sub });
        if (!user) {
            throw new createHttpError.Unauthorized('User not found');
            
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ _id: user._id }, { password: hashedPassword })
    } catch (error){
       
        if (error.name === "JsonWebTokenError") {
            throw new createHttpError.Unauthorized("Token is unauthorized");
        }

        if (error.name === "TokenExpiredError") {
            throw new createHttpError.Unauthorized("Token is expired");
        }
        throw error;

    }
}




