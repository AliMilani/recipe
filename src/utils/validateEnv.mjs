import { cleanEnv, str, port } from 'envalid'

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['dev', 'production']
        }),
        MONGODB_URL: str(),
        PORT: port({ default: 3000 }),
        JWT_SECRET: str(),
    })
}

export default validateEnv