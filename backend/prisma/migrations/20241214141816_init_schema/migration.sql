-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('PENDING_SETUP', 'CONFIGURED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('USER_ACTION', 'SYSTEM_EVENT', 'ERROR', 'AUTH', 'API_CALL');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'DEBUG');

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "status" "SystemStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "systemName" TEXT,
    "timezone" TEXT,
    "theme" TEXT DEFAULT 'light',
    "language" TEXT DEFAULT 'pt-BR',
    "brandConfigId" TEXT,
    "chatConfigId" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFromEmail" TEXT,
    "smtpFromName" TEXT,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "webPushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushVapidPublic" TEXT,
    "pushVapidPrivate" TEXT,
    "maxUsersPerChat" INTEGER DEFAULT 50,
    "maxFileSize" INTEGER DEFAULT 5242880,
    "allowedFileTypes" TEXT[] DEFAULT ARRAY['image/jpeg', 'image/png', 'application/pdf']::TEXT[],
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "whatsappToken" TEXT,
    "telegramEnabled" BOOLEAN NOT NULL DEFAULT false,
    "telegramToken" TEXT,
    "messageRetentionDays" INTEGER DEFAULT 90,
    "autoDeleteInactiveUsers" BOOLEAN NOT NULL DEFAULT false,
    "inactiveUserDays" INTEGER DEFAULT 365,
    "setupCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL DEFAULT 'USER_ACTION',
    "level" "ActivityLevel" NOT NULL DEFAULT 'INFO',
    "source" TEXT NOT NULL DEFAULT 'SYSTEM',
    "action" TEXT NOT NULL DEFAULT 'LEGACY',
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConfig" (
    "id" TEXT NOT NULL,
    "primaryColor" TEXT DEFAULT '#9333EA',
    "secondaryColor" TEXT DEFAULT '#22C55E',
    "fontFamily" TEXT DEFAULT 'Inter',
    "customCSS" TEXT,
    "welcomeMessage" TEXT,
    "offlineMessage" TEXT,
    "autoReply" BOOLEAN NOT NULL DEFAULT true,
    "autoReplyDelay" INTEGER DEFAULT 60,
    "enableFileSharing" BOOLEAN NOT NULL DEFAULT true,
    "enableEmojis" BOOLEAN NOT NULL DEFAULT true,
    "enableTypingIndicator" BOOLEAN NOT NULL DEFAULT true,
    "enableReadReceipts" BOOLEAN NOT NULL DEFAULT true,
    "enableUserProfile" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatingHours" (
    "id" TEXT NOT NULL,
    "chatConfigId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OperatingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandConfig" (
    "id" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#9333EA',
    "secondaryColor" TEXT NOT NULL DEFAULT '#22C55E',
    "accentColor" TEXT NOT NULL DEFAULT '#F59E0B',
    "primaryFont" TEXT NOT NULL DEFAULT 'Inter',
    "secondaryFont" TEXT,
    "companyName" TEXT,
    "slogan" TEXT,
    "description" TEXT,
    "socialLinks" JSONB,
    "customCss" TEXT,
    "customJs" TEXT,
    "loginBackground" TEXT,
    "emailLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_brandConfigId_key" ON "SystemConfig"("brandConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_chatConfigId_key" ON "SystemConfig"("chatConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SystemConfig" ADD CONSTRAINT "SystemConfig_brandConfigId_fkey" FOREIGN KEY ("brandConfigId") REFERENCES "BrandConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfig" ADD CONSTRAINT "SystemConfig_chatConfigId_fkey" FOREIGN KEY ("chatConfigId") REFERENCES "ChatConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatingHours" ADD CONSTRAINT "OperatingHours_chatConfigId_fkey" FOREIGN KEY ("chatConfigId") REFERENCES "ChatConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
