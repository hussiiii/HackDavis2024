/*
  Warnings:

  - You are about to drop the column `shift_end` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `shift_start` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `UserShift` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `day` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shift` DROP COLUMN `shift_end`,
    DROP COLUMN `shift_start`,
    ADD COLUMN `day` VARCHAR(191) NOT NULL,
    ADD COLUMN `week` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserShift` DROP COLUMN `role`;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
