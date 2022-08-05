import dotenv from "dotenv";
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import validateEnv from './validateEnv.mjs'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
/**
 * In es6, if we don't load env from outside the server module, the environment variables will not be available
 * in the internal modules of the app module.
 * So we load the env from outside the server module, this is a workaround for the issue.
 * https://stackoverflow.com/a/42817956
 */
dotenv.config({
    path: path.join(__dirname, '../../.env'),
});

/**
 * Here we used validateEnv, because the modules we have imported in the server module may use it before the envs
 * are validated and cause errors in the program.
 * for example, the "mongoose" module does this to check the schemas.
*/
validateEnv()