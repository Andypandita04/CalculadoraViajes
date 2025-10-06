-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "realExchangeRate" DOUBLE PRECISION NOT NULL,
    "paddedRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "currencyId" TEXT NOT NULL,
    "realExchangeRate" DOUBLE PRECISION NOT NULL,
    "paddedExchangeRate" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "housingCost" DOUBLE PRECISION NOT NULL,
    "foodCost" DOUBLE PRECISION NOT NULL,
    "transportCost" DOUBLE PRECISION NOT NULL,
    "entertainmentCost" DOUBLE PRECISION NOT NULL,
    "insuranceCost" DOUBLE PRECISION NOT NULL,
    "flightCost" DOUBLE PRECISION NOT NULL,
    "communicationCost" DOUBLE PRECISION NOT NULL,
    "activitiesCost" DOUBLE PRECISION NOT NULL,
    "extrasCost" DOUBLE PRECISION NOT NULL,
    "contingencyPercent" DOUBLE PRECISION NOT NULL,
    "bankFeesCost" DOUBLE PRECISION NOT NULL,
    "totalMonthlyLocal" DOUBLE PRECISION NOT NULL,
    "totalMonthlyMxnReal" DOUBLE PRECISION NOT NULL,
    "totalMonthlyMxnPadded" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_forms" (
    "id" TEXT NOT NULL,
    "continente" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "semanasDuracion" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "ahorroTotal" DOUBLE PRECISION NOT NULL,
    "beneficioPreferido" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_symbol_key" ON "currencies"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_country_city_key" ON "destinations"("country", "city");

-- CreateIndex
CREATE UNIQUE INDEX "app_config_key_key" ON "app_config"("key");

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
