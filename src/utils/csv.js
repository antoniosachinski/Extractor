import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEPARADOR = ';';

function reorderDate(value) {
    if (value instanceof Date) {
        const day = String(value.getDate()).padStart(2, '0');
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const year = value.getFullYear();
        const hours = String(value.getHours()).padStart(2, '0');
        const minutes = String(value.getMinutes()).padStart(2, '0');
        const seconds = String(value.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    if (typeof value !== 'string') return value;
    const match = value.match(/(\d{4})([-\/])(\d{2})\2(\d{2})/);
    if (!match) return value;
    const [full, year, sep, month, day] = match;
    return value.replace(full, `${day}${sep}${month}${sep}${year}`);
}

function escapeCsvField(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(SEPARADOR) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function exportToCsv(data, dataType, rows) {
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

        const nameArq = `${data}_${dataType}`;
        const BOM = '\uFEFF';
        const outputPath = path.join(__dirname, '..', 'output', `${nameArq}.csv`);

        fs.writeFileSync(outputPath, BOM + linhas.join('\r\n'), 'utf8');
        console.log(`Exportado para ${outputPath} (${rows.length} linhas)`);

    } catch (error) {
        if (error.code === 'EBUSY') {
            console.error(`Erro: o arquivo está aberto em outro programa. Feche e tente novamente.`);
        } else if (error.code === 'ENOENT') {
            console.error(`Erro: pasta output não encontrada em ${path.join(__dirname, '..', 'output')}`);
        } else {
            console.error(`Erro ao exportar CSV:`, error.message);
        }
    }
}