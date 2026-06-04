import { findDatabase } from './database/connection.js'
import { executeExport } from './orchestrators/exportProcess.js'
import { putOnServer } from './utils/putOnServer.js'


// testar conexão (pingar no banco) ---------

//findDatabase("banco3")


// exportar [ DADOS | METADADOS ] ---------

await executeExport('banco1', '2026-05-28')
await executeExport('banco2', '2026-05-28')
