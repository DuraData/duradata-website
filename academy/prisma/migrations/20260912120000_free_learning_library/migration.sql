ALTER TABLE `Tutorial`
    ADD COLUMN `learningObjectives` JSON NULL,
    ADD COLUMN `targetAudience` TEXT NULL,
    ADD COLUMN `prerequisites` TEXT NULL,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'English',
    ADD COLUMN `courseType` VARCHAR(191) NOT NULL DEFAULT 'FREE',
    ADD COLUMN `ownerName` VARCHAR(191) NOT NULL DEFAULT 'Duradata Academy',
    ADD COLUMN `finalProject` JSON NULL,
    ADD COLUMN `sourceReferences` JSON NULL,
    ADD COLUMN `managedKey` VARCHAR(191) NULL,
    ADD COLUMN `managedVersion` INTEGER NULL;

CREATE UNIQUE INDEX `Tutorial_managedKey_key` ON `Tutorial`(`managedKey`);

ALTER TABLE `TutorialQuizQuestion`
    ADD COLUMN `explanation` TEXT NULL;

CREATE TABLE `TutorialEnrollment` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `tutorialId` CHAR(36) NOT NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `TutorialEnrollment_userId_tutorialId_key`(`userId`, `tutorialId`),
    INDEX `TutorialEnrollment_tutorialId_completedAt_idx`(`tutorialId`, `completedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TutorialQuizAttempt` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `quizId` CHAR(36) NOT NULL,
    `answers` JSON NOT NULL,
    `score` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `passed` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TutorialQuizAttempt_userId_quizId_createdAt_idx`(`userId`, `quizId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TutorialCertificate` (
    `id` CHAR(36) NOT NULL,
    `certificateId` VARCHAR(191) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `tutorialId` CHAR(36) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TutorialCertificate_certificateId_key`(`certificateId`),
    UNIQUE INDEX `TutorialCertificate_userId_tutorialId_key`(`userId`, `tutorialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `TutorialEnrollment` ADD CONSTRAINT `TutorialEnrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorialEnrollment` ADD CONSTRAINT `TutorialEnrollment_tutorialId_fkey` FOREIGN KEY (`tutorialId`) REFERENCES `Tutorial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorialQuizAttempt` ADD CONSTRAINT `TutorialQuizAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorialQuizAttempt` ADD CONSTRAINT `TutorialQuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `TutorialQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorialCertificate` ADD CONSTRAINT `TutorialCertificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorialCertificate` ADD CONSTRAINT `TutorialCertificate_tutorialId_fkey` FOREIGN KEY (`tutorialId`) REFERENCES `Tutorial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
