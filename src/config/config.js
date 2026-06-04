import 'dotenv/config'

export const db1config = {
    nameFantasy: process.env.DB1_NAME_FANTASY,
    host: process.env.DB1_HOST,
    port: process.env.DB1_PORT,
    name: process.env.DB1_NAME,
    user: process.env.DB1_USER,
    pass: process.env.DB1_PASSWORD,
}

export const db2config = {
    nameFantasy: process.env.DB2_NAME_FANTASY,
    host: process.env.DB2_HOST,
    port: process.env.DB2_PORT,
    name: process.env.DB2_NAME,
    user: process.env.DB2_USER,
    pass: process.env.DB2_PASSWORD,
}

export const db3config = {
    nameFantasy: process.env.DB3_NAME_FANTASY,
    host: process.env.DB_HOST,
    port: process.env.DB3_PORT,
    name: process.env.DB3_NAME,
    user: process.env.DB3_USER,
    pass: process.env.DB3_PASSWORD,
}

export const company = process.env.COMPANY_ID

export const ssh = {
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT,
    user: process.env.SSH_USER,
    keyPath: process.env.SSH_KEY_PATH
}

export const pastas = [
    {
        local: process.env.PASTA1_LOCAL,
        remoto: process.env.PASTA1_REMOTO
    },
    {
        local: process.env.PASTA2_LOCAL,
        remoto: process.env.PASTA2_REMOTO
    },
]