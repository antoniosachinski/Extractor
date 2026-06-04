import { connectionDatabase } from "./connection.js";
import { exportToCsv } from "../utils/csv.js";
import { company } from "../config/config.js";

export async function metadados(database, data) {
    const conn = await connectionDatabase(database);

    console.log(`Select 'METADADOS' iniciado!`)


    try {
        const [rows] = await conn.query(`
          WITH sb AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY conversation_id ORDER BY startedAt) rn
    FROM conversation_softbox
    WHERE company_id = ${company}
      AND startedAt BETWEEN '${data} 00:00:00' AND '${data} 23:59:59'
),
cf AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY conversation_id ORDER BY conversation_form_id) rn
    FROM conversation_form
)
SELECT
	sb.link,
    sb.conversation_id,
    sb.name,
    cc.telephone AS telefone,
    sb.protocolo,
    u.name AS nome_usuario,
    sb.nome_fila,
    sb.situacao,
    sb.finalizacao,
    sb.reportvalorpesquisa,
    sb.obs_status,
    COALESCE(sb.tempo_ia,'00:00:00') AS tempo_ia,
    COALESCE(sb.tempo_fila,'00:00:00') AS tempo_fila,
    COALESCE(sb.tempo_falado,'00:00:00') AS tempo_falado,
    COALESCE(sb.tempo_total,'00:00:00') AS tempo_total,
    DATE_FORMAT(sb.startedAt,'%d/%m/%Y %H:%i:%s') AS 'Data/Hora Inicio',
	DATE_FORMAT(sb.answerAt,'%d/%m/%Y %H:%i:%s') AS 'Data/Hora Atendimento',
	DATE_FORMAT(sb.closuredAt,'%d/%m/%Y %H:%i:%s') AS 'Data/Hora Fim Atendimento',
	DATE_FORMAT(sb.endedAt,'%d/%m/%Y %H:%i:%s') AS 'Data/Hora Encerramento',
    CASE 
        WHEN ff_fluxo.column_type_id = 11 
        AND LOCATE(CONCAT(cf.value_1, ','), ff_fluxo.choices) > 0
        THEN SUBSTRING(
                ff_fluxo.choices,
                LOCATE(CONCAT(cf.value_1, ','), ff_fluxo.choices) + LENGTH(CONCAT(cf.value_1, ',')),
                LOCATE(';',
                    SUBSTRING(
                        ff_fluxo.choices,
                        LOCATE(CONCAT(cf.value_1, ','), ff_fluxo.choices) + LENGTH(CONCAT(cf.value_1, ',')),
                        LENGTH(ff_fluxo.choices)
                    )
                ) - 1
             )
        ELSE cf.value_1
    END AS Fluxo,
    CASE 
        WHEN ff_subgrupo.column_type_id = 11 
        AND LOCATE(CONCAT(cf.value_2, ','), ff_subgrupo.choices) > 0
        THEN SUBSTRING(
                ff_subgrupo.choices,
                LOCATE(CONCAT(cf.value_2, ','), ff_subgrupo.choices) + LENGTH(CONCAT(cf.value_2, ',')),
                LOCATE(';',
                    SUBSTRING(
                        ff_subgrupo.choices,
                        LOCATE(CONCAT(cf.value_2, ','), ff_subgrupo.choices) + LENGTH(CONCAT(cf.value_2, ',')),
                        LENGTH(ff_subgrupo.choices)
                    )
                ) - 1
             )
        ELSE cf.value_2
    END AS SubGrupo,
    CASE 
        WHEN ff_tab.column_type_id = 11 
        AND LOCATE(CONCAT(cf.value_3, ','), ff_tab.choices) > 0
        THEN SUBSTRING(
                ff_tab.choices,
                LOCATE(CONCAT(cf.value_3, ','), ff_tab.choices) + LENGTH(CONCAT(cf.value_3, ',')),
                LOCATE(';',
                    SUBSTRING(
                        ff_tab.choices,
                        LOCATE(CONCAT(cf.value_3, ','), ff_tab.choices) + LENGTH(CONCAT(cf.value_3, ',')),
                        LENGTH(ff_tab.choices)
                    )
                ) - 1
             )
        ELSE cf.value_3
    END AS Tabulacao
FROM sb
LEFT JOIN cf 
       ON sb.conversation_id = cf.conversation_id
      AND sb.rn = cf.rn
LEFT JOIN conversation_result c 
       ON c.conversation_id = sb.conversation_id
LEFT JOIN conversation_classification cc 
       ON cc.conversation_id = sb.conversation_id
LEFT JOIN user u 
       ON u.user_id = sb.user_id
LEFT JOIN form_field ff_fluxo 
       ON ff_fluxo.form_field_id = cf.form_field_id_1
LEFT JOIN form_field ff_subgrupo 
       ON ff_subgrupo.form_field_id = cf.form_field_id_2
LEFT JOIN form_field ff_tab 
       ON ff_tab.form_field_id = cf.form_field_id_3
ORDER BY sb.conversation_id, sb.startedAt;
        `);

        exportToCsv(database, data, 'METADADOS', rows)

    } catch (error) {
        console.error('Erro na conexão:', error.message);
    } finally {

        await conn.end();
    }
}