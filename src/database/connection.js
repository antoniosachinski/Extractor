import mysql from 'mysql2/promise'
import { db1config, db2config, db3config, ssh } from "../config/config.js"
import { Client } from 'ssh2'

export async function findDatabase(database) {
    const configs = {
        banco1: db1config,
        banco2: db2config,
        banco3: db3config,
    };

    const base = configs[database];

    if (!base) {
        console.log(`Banco "${database}" não encontrado`);

    } else {
        console.log(`Configações do "${database}" encontradas \nTestando a conexão...`)
    }

    const connection = await mysql.createConnection({
        host: base.host,
        user: base.user,
        password: base.pass,
        port: base.port,
        database: base.name,
    });

    try {
        await connection.query('SELECT 1 + 1');
        console.log('A conexão pode ser realizada!');
    } catch (error) {
        console.error('Erro na conexão:', error.message);
    } finally {

        await connection.end();
    }
}

export async function connectionDatabase(database) {
    const config = {
        banco1: db1config,
        banco2: db2config,
        banco3: db3config,
    }
    const base = config[database]

    if (!base) {
        console.log(`Banco "${database}" não encontrado`);

    } else {
        console.log(`Configações do "${database}" encontradas \nIniciando a conexão...`)
    }

    const connection = await mysql.createConnection({
        host: base.host,
        user: base.user,
        password: base.pass,
        port: base.port,
        database: base.name,
    });

    return connection;
}

export const connectionSsh = () => new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => resolve(conn))
    conn.on('error', reject)
    conn.connect({
        host: ssh.host,
        port: ssh.port,
        username: ssh.user,
        privateKey: ssh.keyPath
    })
})

