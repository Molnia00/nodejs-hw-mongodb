import createHttpError from "http-errors";

export function validateBody(schema) {
    return async (req, res, next) => {
        try {
           await schema.validateAsync(req.body)
 
            next()
        } catch (error) {
            const err = error.details.map(details => details.message);
            next(createHttpError.BadRequest(err))
        } 
    }
    
}