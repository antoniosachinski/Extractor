import { dados } from '../database/dados.js'
import { metadados } from '../database/metadados.js'

export async function executeExport(banco, data) {
    await dados(banco, data)
    await metadados(banco, data)
}



