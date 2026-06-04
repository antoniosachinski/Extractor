import { db1config, db2config, db3config, ssh } from "../config/config.js"
import { Client } from 'ssh2'

export const connectionSsh = () => new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => resolve(conn))
    conn.on('error', reject)
    conn.connect({
        host: ssh.host,
        port: ssh.port || 22,
        username: ssh.user,
        password: ssh.pass
    })
})