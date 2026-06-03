import 'dotenv/config'

export const db1config = {
    host: process.env.DB1_HOST,
    port: process.env.DB1_PORT,
    name: process.env.DB1_NAME,
    user: process.env.DB1_USER,
    pass: process.env.DB1_PASSWORD,
}

export const db2config = {
    host: process.env.DB2_HOST,
    port: process.env.DB2_PORT,
    name: process.env.DB2_NAME,
    user: process.env.DB2_USER,
    pass: process.env.DB2_PASSWORD,
}

export const db3config = {
    host: process.env.DB_HOST,
    port: process.env.DB3_PORT,
    name: process.env.DB3_NAME,
    user: process.env.DB3_USER,
    pass: process.env.DB3_PASSWORD,
}

export const company = process.env.COMPANY_ID

export const ssh1 = {
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT,
    user: process.env.SSH_USER,
    pass: process.env.SSH_KEY_PATH
}