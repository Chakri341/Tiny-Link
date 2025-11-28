-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");

-- CreateIndex
CREATE INDEX "Link_expiresAt_idx" ON "Link"("expiresAt");

-- CreateIndex
CREATE INDEX "Link_clicks_idx" ON "Link"("clicks");

-- CreateIndex
CREATE INDEX "Link_createdAt_code_idx" ON "Link"("createdAt", "code");
