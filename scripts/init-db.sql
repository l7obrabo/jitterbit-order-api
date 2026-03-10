-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS "Order" (
  "orderId" VARCHAR(255) PRIMARY KEY,
  "value" INTEGER NOT NULL,
  "creationDate" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS "Items" (
  "orderId" VARCHAR(255) NOT NULL REFERENCES "Order"("orderId") ON DELETE CASCADE,
  "productId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  PRIMARY KEY ("orderId", "productId")
);

CREATE INDEX IF NOT EXISTS idx_items_order_id ON "Items"("orderId");
