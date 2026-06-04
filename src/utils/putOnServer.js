import { connectionSsh } from "../database/connection.js";
import { pastas } from "../config/config.js";
import fs from "fs/promises";

export async function putOnServer() {
  const conn = await connectionSsh()

  return new Promise((resolve, reject) => {
    conn.sftp(async (err, sftp) => {
      if (err) return reject(err)

      try {
        for (const pasta of pastas) {
          const arquivos = await fs.readdir(pasta.local)

          for (const arquivo of arquivos) {
            const localPath  = `${pasta.local}/${arquivo}`
            const remotePath = `${pasta.remoto}/${arquivo}`

            await new Promise((res, rej) => {
              sftp.fastPut(localPath, remotePath, (err) => {
                if (err) return rej(err)
                console.log(`Enviado: ${arquivo}`)
                res()
              })
            })
          }
        }

        conn.end()
        resolve()
      } catch (err) {
        conn.end()
        reject(err)
      }
    })
  })
}