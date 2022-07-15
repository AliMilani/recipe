import bcrypt from 'bcryptjs'

export const passwordHash = async (pass) => {
    const saltRounds = 10
    return await bcrypt.hash(pass, saltRounds)
}

export const passwordVerify = (pass, hash) => {
    return new Promise(async (resolve, reject) => {
        hash = hash.replace('$2y$', '$2a$')
        const match = await bcrypt.compare(pass, hash);
        match ? resolve(true) : reject()
    })
}
