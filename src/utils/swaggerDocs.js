import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';


export function swaggerDocs() {
    try {
        const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
        
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.log(err);

    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
}