-- CreateTable
CREATE TABLE `ClockOut` (
    `clockout_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `volunteer` VARCHAR(191) NOT NULL,
    `rating` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `tasksCompleted` VARCHAR(191) NOT NULL,
    `items` VARCHAR(191) NOT NULL,
    `reachOut` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`clockout_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
