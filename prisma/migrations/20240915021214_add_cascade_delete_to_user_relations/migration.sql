-- DropForeignKey
ALTER TABLE `UserAvailability` DROP FOREIGN KEY `UserAvailability_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserShift` DROP FOREIGN KEY `UserShift_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `UserAvailability` ADD CONSTRAINT `UserAvailability_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShift` ADD CONSTRAINT `UserShift_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
