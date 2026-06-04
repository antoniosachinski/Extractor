import { connectionDatabase } from "./connection.js";
import { exportToCsv } from "../utils/csv.js";

export async function dados(database, data) {
    const conn = await connectionDatabase(database);

    console.log('Select iniciado!')

    try {
        const [rows] = await conn.query(`
          SELECT c.conversation_id, m.createdAt, text, from_name, to_name, cc.link
FROM message m
JOIN conversation c ON m.conversation_id = c.conversation_id
JOIN conversation_classification cc ON cc.conversation_id = m.conversation_id
WHERE c.transferedAt IS NOT NULL
  AND c.createdAt BETWEEN '${data} 00:00:00' AND '${data} 23:59:59'
ORDER BY c.createdAt asc;
        `);

        exportToCsv(data, 'DADOS', rows)

    } catch (error) {
        console.error('Erro na conexão:', error.message);
    } finally {

        await conn.end();
    }
}