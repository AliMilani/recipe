import { cleanEnv, str, port } from 'envalid'

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        MONGODB_URL: str(),
        PORT: port({ default: 3000 }),
    })
}

export default validateEnv