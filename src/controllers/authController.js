
import { loginUser, logoutUser, refreshUser, registerUser } from "../services/auth.js"

export async function registerController(req, res) {

    const User = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: User,
    })
}


export async function loginController(req, res) {

    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil, 
    })
    

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil, 
    })



    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        accessToken: session.accessToken,
    })
}


export async function logoutController(req, res) {
    const { refreshToken, sessionId } = req.cookies;
    if (typeof sessionId === 'string') {
        await logoutUser(refreshToken, sessionId)
    }

    res.clearCookie('sessionId')
    res.clearCookie('refreshToken')

    res.status(204).end();
}

export async function refreshController(req, res) {
    const { refreshToken, sessionId } = req.cookies;
    const session = await refreshUser(refreshToken, sessionId)

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil, 
    })
    

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil, 
    })



    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    })
}