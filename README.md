# API de Pedidos

API em Node.js (Express) para gerenciar pedidos: criar, listar, buscar por número, atualizar e excluir. Persistência em PostgreSQL usando Sequelize (ORM).

## O que precisa

- Node.js 16+
- PostgreSQL

## Como rodar

Clone o repositório, crie o banco (`createdb jitterbit_orders` ou pelo pgAdmin) e configure o `.env` a partir do `.env.example` (principalmente `DB_PASSWORD`). Depois:

```bash
npm install
npm start
```

As tabelas são criadas automaticamente na primeira subida (Sequelize sync). A API sobe em `http://localhost:3000`.

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/order` | Cria um pedido |
| GET | `/order/:orderId` | Busca um pedido pelo número |
| GET | `/order/list` | Lista todos os pedidos |
| PUT | `/order/:orderId` | Atualiza um pedido |
| DELETE | `/order/:orderId` | Remove um pedido |

### Exemplo de body (POST /order)

A API aceita o formato abaixo e faz o mapeamento internamente (numeroPedido → orderId, valorTotal → value, etc.):

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
  ]
}
```

### Respostas de erro

- **400** — Dados inválidos
- **404** — Pedido não encontrado
- **409** — Número de pedido já existe
- **500** — Erro interno

## Estrutura

```
├── server.js
├── src/
│   ├── app.js
│   ├── models/          # Sequelize (Order, Item)
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   └── utils/          # orderMapper (request → modelo)
└── test/
```

## Testes

```bash
npm test
```

Testes do mapper (não precisam de banco). O GitHub Actions roda os testes em cada push.

## Licença

MIT
