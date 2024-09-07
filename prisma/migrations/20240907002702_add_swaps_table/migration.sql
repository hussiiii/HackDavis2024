-- CreateTable
CREATE TABLE `Swaps` (
    `swap_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `requester` VARCHAR(191) NOT NULL,
    `requesterPhone` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`swap_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
