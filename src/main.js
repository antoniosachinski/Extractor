import { findDatabase } from './database/connection.js'
import { executeExport } from './orchestrators/exportProcess.js'


// testar conexão (pingar no banco) ---------

//findDatabase("banco3")


// exportar [ DADOS | METADADOS ] ---------

executeExport('banco3', '2026-05-28')