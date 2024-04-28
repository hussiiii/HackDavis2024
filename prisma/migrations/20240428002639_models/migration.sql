-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shift` (
    `shift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_start` DATETIME(3) NOT NULL,
    `shift_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`shift_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserShift` (
    `usershift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `shift_id` INTEGER NOT NULL,
    `role` VARCHAR(191) NULL,

    UNIQUE INDEX `UserShift_user_id_shift_id_key`(`user_id`, `shift_id`),
    PRIMARY KEY (`usershift_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserShift` ADD CONSTRAINT `UserShift_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShift` ADD CONSTRAINT `UserShift_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `Shift`(`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
