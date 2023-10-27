/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
