-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "addressline" TEXT NOT NULL,
    "addressline2" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentId" TEXT,
    "customerId" TEXT,
    "idempotencyKey" TEXT,
    "receiptUrl" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "billId" TEXT,
    "vendorId" TEXT,
    "shippingCost" INTEGER,
    "shipped" BOOLEAN DEFAULT false,
    "received" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qbBill" (
    "id" TEXT NOT NULL,
    "billId" INTEGER NOT NULL,
    "billSyncToken" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qbBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickbookVendor" (
    "id" TEXT NOT NULL,
    "qbId" INTEGER NOT NULL,
    "qbSyncToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickbookVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickbooksToken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "x_refresh_token_expires_in" INTEGER NOT NULL,
    "id_token" TEXT NOT NULL,
    "latency" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickbooksToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_orderId_key" ON "Item"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_key" ON "Order"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_receiptUrl_key" ON "Order"("receiptUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Order_billId_key" ON "Order"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_vendorId_key" ON "Order"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "qbBill_id_key" ON "qbBill"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuickbookVendor_id_key" ON "QuickbookVendor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuickbooksToken_id_key" ON "QuickbooksToken"("id");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billId_fkey" FOREIGN KEY ("billId") REFERENCES "qbBill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "QuickbookVendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qbBill" ADD CONSTRAINT "qbBill_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "QuickbookVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
