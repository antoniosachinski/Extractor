import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db1config, db2config, db3config } from '../config/config.js';
import { putOnServer } from './putOnServer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEPARADOR = ';';

const nameConfig = {
    banco1: db1config,
    banco2: db2config,
    banco3: db3config,
};

function reorderDate(value) {
    // Normaliza qualquer Date ou string ISO para dd/mm/yyyy hh:mm:ss
    if (value instanceof Date) {
        if (isNaN(value.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
    }

    if (typeof value !== 'string') return value;

    // Tenta parsear strings no formato ISO (yyyy-mm-dd ou yyyy/mm/dd, com ou sem horário)
    const isoMatch = value.match(/^(\d{4})([-\/])(\d{2})\2(\d{2})([T ](\d{2}:\d{2}(:\d{2})?))?/);
    if (isoMatch) {
        const [, year, sep, month, day, , time] = isoMatch;
        const datePart = `${day}${sep}${month}${sep}${year}`;
        return time ? `${datePart} ${time}` : datePart;
    }

    return value;
}

function escapeCsvField(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(SEPARADOR) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function exportToCsv(database, periodo, dataType, rows) {
    // Valida o banco solicitado
    const base = nameConfig[database];
    if (!base) {
        console.error(`Erro: banco desconhecido "${database}". Opções: ${Object.keys(nameConfig).join(', ')}`);
        return;
    }

    try {
        if (!rows || rows.length === 0) throw new Error('Nenhum dado para exportar');

        const headers = Object.keys(rows[0]);

        const linhas = [
            headers.map(escapeCsvField).join(SEPARADOR),
            ...rows.map(row =>
                headers
                    .map(h => escapeCsvField(reorderDate(row[h])))
                    .join(SEPARADOR)
            ),
        ];

        const nameArq = `${periodo}_${dataType}`;
        const BOM = '\uFEFF';
        const outputDir = path.join(__dirname, '..', 'output', base.nameFantasy);
        const outputPath = path.join(outputDir, `${nameArq}.csv`);

        // Cria a pasta automaticamente se não existir
        fs.mkdirSync(outputDir, { recursive: true });

        fs.writeFileSync(outputPath, BOM + linhas.join('\r\n'), 'utf8');
        console.log(`Exportado para ${outputPath} (${rows.length} linhas)`);


    } catch (error) {
        if (error.code === 'EBUSY') {
            console.error(`Erro: o arquivo está aberto em outro programa. Feche e tente novamente.`);
        } else {
            console.error(`Erro ao exportar CSV:`, error.message);
        }
    }
}