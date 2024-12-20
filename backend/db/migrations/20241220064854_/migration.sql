/*
  Warnings:

  - You are about to drop the column `channelData` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `customFields` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `firstResponseAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `ratingComment` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `reopenedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `slaStatus` on the `Conversation` table. All the data in the column will be lost.
  - The `status` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `attachments` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `Message` table. All the data in the column will be lost.
  - Made the column `contactId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING_SETUP');

-- CreateEnum
CREATE TYPE "ConnectorStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR', 'PENDING_SETUP');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChannelSource" ADD VALUE 'WHATSAPP_API';
ALTER TYPE "ChannelSource" ADD VALUE 'WHATSAPP_EVOLUTION';
ALTER TYPE "ChannelSource" ADD VALUE 'SMS';
ALTER TYPE "ChannelSource" ADD VALUE 'TWILIO';

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "channelData",
DROP COLUMN "closedAt",
DROP COLUMN "customFields",
DROP COLUMN "firstResponseAt",
DROP COLUMN "rating",
DROP COLUMN "ratingComment",
DROP COLUMN "reopenedAt",
DROP COLUMN "resolvedAt",
DROP COLUMN "slaStatus",
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "unreadCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN',
DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ALTER COLUMN "contactId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inbox" ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "attachments",
DROP COLUMN "private",
ADD COLUMN     "contactId" TEXT,
ADD COLUMN     "isFromContact" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "source" "ChannelSource" NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "connectorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" "ChannelSource" NOT NULL,
    "config" JSONB NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "ConnectorStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationChannel" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationConnector" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationConnector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationChannel_organizationId_channelId_key" ON "OrganizationChannel"("organizationId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationConnector_organizationId_connectorId_key" ON "OrganizationConnector"("organizationId", "connectorId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannel" ADD CONSTRAINT "OrganizationChannel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationChannel" ADD CONSTRAINT "OrganizationChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationConnector" ADD CONSTRAINT "OrganizationConnector_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationConnector" ADD CONSTRAINT "OrganizationConnector_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
