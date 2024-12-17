CREATE TABLE "channelWhatsappEvolutionAPI" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "session" TEXT,
    "qrcode" TEXT,
    "status" VARCHAR(255),
    "battery" VARCHAR(255),
    "plugged" BOOLEAN,
    "retries" INTEGER DEFAULT 0,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "organizationId" INTEGER REFERENCES "Organization"("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

