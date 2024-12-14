-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentOrgId_fkey" FOREIGN KEY ("currentOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
