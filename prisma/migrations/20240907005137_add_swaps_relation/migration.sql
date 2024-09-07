/*
  Warnings:

  - Added the required column `shift_id` to the `Swaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Swaps` ADD COLUMN `shift_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Swaps_shift_id_idx` ON `Swaps`(`shift_id`);

-- AddForeignKey
ALTER TABLE `Swaps` ADD CONSTRAINT `Swaps_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `Shift`(`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
