/**
 * Converte o payload da API (formato de entrada) para o formato usado no banco.
 * numeroPedido -> orderId, valorTotal -> value, dataCriacao -> creationDate
 * items: idItem -> productId (number), quantidadeItem -> quantity, valorItem -> price
 */
function mapRequestBodyToOrder(body) {
  if (!body || typeof body !== 'object') {
    throw new Error('Dados do pedido inválidos');
  }

  const { numeroPedido, valorTotal, dataCriacao, items } = body;

  if (!numeroPedido || valorTotal == null) {
    throw new Error('numeroPedido e valorTotal são obrigatórios');
  }

  let creationDate = dataCriacao;
  if (creationDate) {
    const parsed = new Date(creationDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error('dataCriacao inválida');
    }
    creationDate = parsed.toISOString();
  } else {
    creationDate = new Date().toISOString();
  }

  const mappedItems = Array.isArray(items)
    ? items.map((item) => ({
        productId: parseInt(item.idItem, 10),
        quantity: parseInt(item.quantidadeItem, 10) || 0,
        price: parseInt(item.valorItem, 10) || 0,
      }))
    : [];

  return {
    orderId: String(numeroPedido).trim(),
    value: parseInt(valorTotal, 10),
    creationDate,
    items: mappedItems,
  };
}

/**
 * Monta o objeto de pedido no formato de resposta (como está no banco).
 */
function mapOrderToResponse(orderRow, itemsRows = []) {
  if (!orderRow) return null;

  return {
    orderId: orderRow.orderId,
    value: orderRow.value,
    creationDate: orderRow.creationDate,
    items: (itemsRows || []).map((row) => ({
      productId: row.productId,
      quantity: row.quantity,
      price: row.price,
    })),
  };
}

module.exports = {
  mapRequestBodyToOrder,
  mapOrderToResponse,
};
