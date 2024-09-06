-- CreateTable
CREATE TABLE `ClockIn` (
    `clockin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `volunteer` VARCHAR(191) NOT NULL,
    `covolunteer` VARCHAR(191) NOT NULL,
    `onTime` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`clockin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
