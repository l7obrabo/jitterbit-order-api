# API de Pedidos - Jitterbit

API em Node.js (Express) para criar, listar, atualizar e excluir pedidos. Os dados são persistidos em PostgreSQL.

## Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL instalado e rodando

## Configuração

1. Clone o repositório e entre na pasta do projeto.

2. Instale as dependências:

```bash
npm install
```

3. Crie o banco de dados no PostgreSQL:

```bash
createdb jitterbit_orders
```

4. Crie as tabelas executando o script SQL:

```bash
psql -U postgres -d jitterbit_orders -f scripts/init-db.sql
```

5. Copie o arquivo de ambiente e ajuste as variáveis:

```bash
cp .env.example .env
```

Edite o `.env` e preencha `DB_PASSWORD` (e outros valores se necessário).

## Executando a API

```bash
npm start
```

A API sobe em `http://localhost:3000`.

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/order` | Cria um novo pedido |
| GET | `/order/:orderId` | Retorna um pedido pelo número |
| GET | `/order/list` | Lista todos os pedidos |
| PUT | `/order/:orderId` | Atualiza um pedido |
| DELETE | `/order/:orderId` | Remove um pedido |

### Criar pedido (POST /order)

O body deve ser enviado no formato abaixo. A API faz o mapeamento internamente para o modelo do banco (orderId, value, creationDate, items com productId, quantity, price).

**Exemplo de body:**

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Exemplo com cURL:**

```bash
curl --location 'http://localhost:3000/order' \
  --header 'Content-Type: application/json' \
  --data '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Obter pedido (GET /order/:orderId)

Exemplo: `GET http://localhost:3000/order/v10089016vdb`

### Listar pedidos (GET /order/list)

Exemplo: `GET http://localhost:3000/order/list`

### Atualizar pedido (PUT /order/:orderId)

Envie o body no mesmo formato do POST (numeroPedido pode ser omitido; o número do pedido é o da URL).

### Deletar pedido (DELETE /order/:orderId)

Exemplo: `DELETE http://localhost:3000/order/v10089016vdb` — retorna 204 sem corpo.

## Estrutura do projeto

```
├── server.js           # ponto de entrada
├── src/
│   ├── app.js          # configuração do Express e rotas
│   ├── config/
│   │   └── database.js # pool PostgreSQL
│   ├── controllers/
│   │   └── orderController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── orderRoutes.js
│   ├── services/
│   │   └── orderService.js
│   └── utils/
│       └── orderMapper.js  # mapeamento request -> banco
└── scripts/
    └── init-db.sql     # criação das tabelas
```

## Respostas de erro

- **400** — Dados inválidos (body incorreto ou campos obrigatórios faltando).
- **404** — Pedido não encontrado (GET por id, PUT ou DELETE).
- **409** — Conflito ao criar pedido (número de pedido já existe).
- **500** — Erro interno do servidor.

## Testes

```bash
npm test
```

Os testes cobrem o mapeamento de dados (request → banco). Não precisam de PostgreSQL.

## Como subir no GitHub (usuário l7obrabo)

1. **Crie o repositório no GitHub** (vazio, sem README):  
   [https://github.com/new?name=jitterbit-order-api](https://github.com/new?name=jitterbit-order-api)

2. **Na pasta do projeto**, no PowerShell (com Node e Git instalados), rode:

```powershell
.\subir-github.ps1
```

O script instala dependências, roda os testes, faz o commit e o push para `https://github.com/l7obrabo/jitterbit-order-api`.

**Ou manualmente:**

```bash
npm install
npm test
git init
git add .
git commit -m "feat: API de pedidos com CRUD e PostgreSQL"
git branch -M main
git remote add origin https://github.com/l7obrabo/jitterbit-order-api.git
git push -u origin main
```

3. Depois do primeiro push, o GitHub Actions roda os testes em cada push e pull request.

## Licença

MIT
