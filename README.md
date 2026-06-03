# 📦 Extractor

Ferramenta Node.js para extração de dados de conversas/atendimentos de bancos de dados MySQL, exportando os resultados em arquivos CSV formatados.

---

## 📋 Visão Geral

O **Extractor** conecta a bancos de dados MySQL de plataformas de atendimento e gera dois tipos de relatório CSV para uma data específica:

- **DADOS** — mensagens trocadas nas conversas transferidas no dia
- **METADADOS** — informações completas dos atendimentos (fila, agente, tempos, tabulação, etc.)

---

## 🗂️ Estrutura do Projeto

```
extractor/
├── src/
│   ├── config/
│   │   ├── config.js         # Configurações dos bancos de dados
│   │   └── env.js            # Variáveis de ambiente
│   ├── database/
│   │   ├── connection.js     # Gerenciamento de conexões MySQL
│   │   ├── dados.js          # Query e exportação de DADOS
│   │   └── metadados.js      # Query e exportação de METADADOS
│   ├── orchestrators/
│   │   └── exportProcess.js  # Orquestra o processo de exportação
│   ├── output/               # Arquivos CSV gerados
│   └── utils/
│       └── csv.js            # Utilitário de geração de CSV
├── main.js                   # Ponto de entrada
├── package.json
└── README.md
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Acesso aos bancos de dados MySQL configurados

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd extractor

# Instale as dependências
npm install
```

---

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto com as credenciais dos bancos:

```env
# Banco 1
DB1_HOST=
DB1_PORT=3306
DB1_NAME=
DB1_USER=
DB1_PASS=

# Banco 2
DB2_HOST=
DB2_PORT=3306
DB2_NAME=
DB2_USER=
DB2_PASS=

# Banco 3
DB3_HOST=
DB3_PORT=3306
DB3_NAME=
DB3_USER=
DB3_PASS=
```

### Referência de bancos

| Alias    | Descrição         |
|----------|-------------------|
| `banco1` |        ``         |
| `banco2` |        ``         |
| `banco3` | Localhost         |

---

## 📤 Uso

### Executar exportação

Edite o arquivo `src/main.js` informando o banco e a data desejada:

```js
executeExport('banco1', '2026-05-28')
```

Em seguida, execute:

```bash
node src/main.js
```

### Testar conexão com um banco

Para verificar se a conexão com um banco está funcionando antes de exportar, descomente a linha no `main.js`:

```js
findDatabase("banco1")
```

---

## 📁 Saída

Os arquivos CSV são gerados na pasta `src/output/` com o seguinte padrão de nomenclatura:

```
YYYY-MM-DD_DADOS.csv
YYYY-MM-DD_METADADOS.csv
```

**Exemplo:**
```
src/output/
├── 2026-05-28_DADOS.csv
└── 2026-05-28_METADADOS.csv
```

> Os arquivos são gerados com **BOM UTF-8** e separador `;` para compatibilidade com o Microsoft Excel.

---

## 📊 Relatórios Gerados

### DADOS
Exporta as mensagens de conversas que foram transferidas na data informada.

| Campo           | Descrição                        |
|-----------------|----------------------------------|
| conversation_id | ID da conversa                   |
| createdAt       | Data/hora da mensagem            |
| text            | Conteúdo da mensagem             |
| from_name       | Remetente                        |
| to_name         | Destinatário                     |
| link            | Link da conversa                 |

### METADADOS
Exporta os dados completos dos atendimentos iniciados na data informada.

| Campo                  | Descrição                          |
|------------------------|------------------------------------|
| conversation_id        | ID da conversa                     |
| name                   | Nome do contato                    |
| telefone               | Telefone do contato                |
| protocolo              | Número de protocolo                |
| nome_usuario           | Nome do agente                     |
| nome_fila              | Fila de atendimento                |
| situacao / finalizacao | Status do atendimento              |
| tempo_ia               | Tempo em atendimento pelo bot      |
| tempo_fila             | Tempo de espera na fila            |
| tempo_falado           | Tempo de atendimento humano        |
| tempo_total            | Tempo total da conversa            |
| Data/Hora Inicio       | Início da conversa                 |
| Data/Hora Atendimento  | Momento do atendimento humano      |
| Data/Hora Fim          | Fim do atendimento                 |
| Data/Hora Encerramento | Encerramento da conversa           |
| Fluxo / SubGrupo / Tabulacao | Campos de tabulação do atendimento |

---

## 🛠️ Scripts

```bash
# Executar o projeto
node src/main.js
```

---

## 📦 Dependências

| Pacote          | Versão   | Descrição                     |
|-----------------|----------|-------------------------------|
| `mysql2`        | latest   | Cliente MySQL com suporte a promises |

---

