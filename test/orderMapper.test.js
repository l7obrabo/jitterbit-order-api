const { describe, it } = require('node:test');
const assert = require('node:assert');
const { mapRequestBodyToOrder, mapOrderToResponse } = require('../src/utils/orderMapper');

describe('orderMapper', () => {
  describe('mapRequestBodyToOrder', () => {
    it('converte body da API para formato do banco', () => {
      const body = {
        numeroPedido: 'v10089015vdb-01',
        valorTotal: 10000,
        dataCriacao: '2023-07-19T12:24:11.5299601+00:00',
        items: [
          { idItem: '2434', quantidadeItem: 1, valorItem: 1000 },
        ],
      };
      const result = mapRequestBodyToOrder(body);
      assert.strictEqual(result.orderId, 'v10089015vdb-01');
      assert.strictEqual(result.value, 10000);
      assert.ok(result.creationDate.endsWith('Z') || result.creationDate.includes('+'));
      assert.strictEqual(result.items.length, 1);
      assert.strictEqual(result.items[0].productId, 2434);
      assert.strictEqual(result.items[0].quantity, 1);
      assert.strictEqual(result.items[0].price, 1000);
    });

    it('usa data atual quando dataCriacao não é enviada', () => {
      const body = { numeroPedido: 'ped-1', valorTotal: 500, items: [] };
      const result = mapRequestBodyToOrder(body);
      assert.strictEqual(result.orderId, 'ped-1');
      assert.strictEqual(result.value, 500);
      assert.ok(result.creationDate);
      assert.ok(new Date(result.creationDate).getTime() > 0);
    });

    it('lança erro quando body é inválido', () => {
      const msg = 'Dados do pedido inválidos';
      assert.throws(() => mapRequestBodyToOrder(null), (err) => err.message === msg);
      assert.throws(() => mapRequestBodyToOrder(undefined), (err) => err.message === msg);
      assert.throws(() => mapRequestBodyToOrder(''), (err) => err.message === msg);
    });

    it('lança erro quando numeroPedido ou valorTotal faltam', () => {
      assert.throws(() => mapRequestBodyToOrder({ valorTotal: 10 }), (err) =>
        err.message.includes('obrigatórios')
      );
      assert.throws(() => mapRequestBodyToOrder({ numeroPedido: 'x' }), (err) =>
        err.message.includes('obrigatórios')
      );
    });

    it('lança erro quando dataCriacao é inválida', () => {
      assert.throws(
        () => mapRequestBodyToOrder({ numeroPedido: 'x', valorTotal: 1, dataCriacao: 'invalid' }),
        (err) => err.message.includes('dataCriacao inválida')
      );
    });

    it('retorna items vazios quando items não é array', () => {
      const result = mapRequestBodyToOrder({ numeroPedido: 'a', valorTotal: 0 });
      assert.deepStrictEqual(result.items, []);
    });
  });

  describe('mapOrderToResponse', () => {
    it('monta resposta a partir de linha do banco e itens', () => {
      const orderRow = { orderId: 'v1', value: 100, creationDate: '2023-07-19T12:00:00.000Z' };
      const itemsRows = [{ productId: 1, quantity: 2, price: 50 }];
      const result = mapOrderToResponse(orderRow, itemsRows);
      assert.strictEqual(result.orderId, 'v1');
      assert.strictEqual(result.value, 100);
      assert.strictEqual(result.creationDate, '2023-07-19T12:00:00.000Z');
      assert.strictEqual(result.items.length, 1);
      assert.strictEqual(result.items[0].productId, 1);
      assert.strictEqual(result.items[0].quantity, 2);
      assert.strictEqual(result.items[0].price, 50);
    });

    it('retorna null quando orderRow é null', () => {
      assert.strictEqual(mapOrderToResponse(null), null);
    });

    it('retorna items vazios quando itemsRows não é passado', () => {
      const orderRow = { orderId: 'v1', value: 0, creationDate: new Date().toISOString() };
      const result = mapOrderToResponse(orderRow);
      assert.deepStrictEqual(result.items, []);
    });
  });
});
