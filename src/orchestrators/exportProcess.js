import { dados } from '../database/dados.js'
import { metadados } from '../database/metadados.js'
import putOnServer from '../utils/putOnServer.js'

export async function executeExport(banco, data) {
    await dados(banco, data)
    await metadados(banco, data)
}



