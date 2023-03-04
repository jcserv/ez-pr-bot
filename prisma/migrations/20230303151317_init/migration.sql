-- CreateTable
CREATE TABLE "Installation" (
    "id" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "bot" TEXT NOT NULL,
    "enterprise" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "isEnterpriseInstall" BOOLEAN NOT NULL,
    "appId" TEXT NOT NULL,
    "authVersion" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Installation_id_key" ON "Installation"("id");
