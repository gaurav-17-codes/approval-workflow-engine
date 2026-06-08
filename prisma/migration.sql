-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('TEACHER', 'HOD', 'PRINCIPAL', 'ADMIN') NOT NULL DEFAULT 'TEACHER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalRequest` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` ENUM('LEAVE', 'BUDGET', 'INFRASTRUCTURE', 'ACADEMIC', 'OTHER') NOT NULL,
    `description` TEXT NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `submittedById` VARCHAR(191) NOT NULL,

    INDEX `ApprovalRequest_submittedById_idx`(`submittedById`),
    INDEX `ApprovalRequest_status_idx`(`status`),
    INDEX `ApprovalRequest_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalStep` (
    `id` VARCHAR(191) NOT NULL,
    `stepOrder` INTEGER NOT NULL,
    `approverRole` ENUM('TEACHER', 'HOD', 'PRINCIPAL', 'ADMIN') NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `comment` TEXT NULL,
    `actionedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requestId` VARCHAR(191) NOT NULL,
    `actionedById` VARCHAR(191) NULL,

    INDEX `ApprovalStep_requestId_idx`(`requestId`),
    INDEX `ApprovalStep_actionedById_fkey`(`actionedById`),
    UNIQUE INDEX `ApprovalStep_requestId_stepOrder_key`(`requestId`, `stepOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApprovalRequest` ADD CONSTRAINT `ApprovalRequest_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalStep` ADD CONSTRAINT `ApprovalStep_actionedById_fkey` FOREIGN KEY (`actionedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalStep` ADD CONSTRAINT `ApprovalStep_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ApprovalRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ===== INSERT DUMMY DATA =====

-- Insert Users
INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `createdAt`) VALUES
('user_teacher_1', 'Rajesh Kumar', 'rajesh.kumar@school.edu', '$2b$10$dummyhash1', 'TEACHER', NOW()),
('user_teacher_2', 'Priya Singh', 'priya.singh@school.edu', '$2b$10$dummyhash2', 'TEACHER', NOW()),
('user_teacher_3', 'Amit Patel', 'amit.patel@school.edu', '$2b$10$dummyhash3', 'TEACHER', NOW()),
('user_hod_1', 'Dr. Vikram Sharma', 'vikram.sharma@school.edu', '$2b$10$dummyhash4', 'HOD', NOW()),
('user_hod_2', 'Ms. Neha Gupta', 'neha.gupta@school.edu', '$2b$10$dummyhash5', 'HOD', NOW()),
('user_principal_1', 'Prof. Rajendra Nath', 'principal@school.edu', '$2b$10$dummyhash6', 'PRINCIPAL', NOW()),
('user_admin_1', 'Admin User', 'admin@school.edu', '$2b$10$dummyhash7', 'ADMIN', NOW());

-- Insert Approval Requests
INSERT INTO `ApprovalRequest` (`id`, `title`, `category`, `description`, `priority`, `status`, `createdAt`, `updatedAt`, `submittedById`) VALUES
('req_001', 'Annual Leave Request - Summer Vacation', 'LEAVE', 'Requesting 2 weeks leave during summer break for family vacation', 'MEDIUM', 'PENDING', NOW(), NOW(), 'user_teacher_1'),
('req_002', 'Budget Allocation for Science Lab', 'BUDGET', 'Need budget approval for new microscopes and chemistry equipment for the science lab', 'HIGH', 'PENDING', NOW(), NOW(), 'user_hod_1'),
('req_003', 'New Classroom Infrastructure', 'INFRASTRUCTURE', 'Requesting funds to upgrade 3 classrooms with smart boards and improved seating', 'HIGH', 'APPROVED', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), 'user_teacher_2'),
('req_004', 'Academic Curriculum Update', 'ACADEMIC', 'Proposal to introduce coding and digital literacy in the 9th-grade curriculum', 'MEDIUM', 'PENDING', NOW(), NOW(), 'user_hod_2'),
('req_005', 'Professional Development Training', 'OTHER', 'Requesting approval to attend international educators conference', 'LOW', 'APPROVED', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW(), 'user_teacher_3'),
('req_006', 'Medical Leave Request', 'LEAVE', 'Emergency medical leave for personal health reasons - 3 days', 'HIGH', 'PENDING', NOW(), NOW(), 'user_teacher_1'),
('req_007', 'Sports Equipment Purchase', 'BUDGET', 'Requesting budget for new cricket and badminton equipment for school sports', 'MEDIUM', 'APPROVED', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), 'user_teacher_2'),
('req_008', 'Library Renovation Project', 'INFRASTRUCTURE', 'Complete renovation of library with digital catalog system', 'URGENT', 'PENDING', NOW(), NOW(), 'user_hod_1');

-- Insert Approval Steps for req_001 (Pending - in HOD stage)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_001_1', 1, 'HOD', 'ACTIVE', NULL, NULL, NOW(), 'req_001', NULL),
('step_001_2', 2, 'PRINCIPAL', 'PENDING', NULL, NULL, NOW(), 'req_001', NULL);

-- Insert Approval Steps for req_002 (Pending - in Principal stage)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_002_1', 1, 'HOD', 'APPROVED', 'Approved by HOD. Lab equipment essential for curriculum.', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 'req_002', 'user_hod_1'),
('step_002_2', 2, 'PRINCIPAL', 'ACTIVE', NULL, NULL, NOW(), 'req_002', NULL);

-- Insert Approval Steps for req_003 (Approved)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_003_1', 1, 'HOD', 'APPROVED', 'Good infrastructure plan', DATE_SUB(NOW(), INTERVAL 4 DAY), NOW(), 'req_003', 'user_hod_2'),
('step_003_2', 2, 'PRINCIPAL', 'APPROVED', 'Approved. Budget allocated.', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), 'req_003', 'user_principal_1');

-- Insert Approval Steps for req_004 (Pending - in HOD stage)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_004_1', 1, 'HOD', 'ACTIVE', NULL, NULL, NOW(), 'req_004', NULL),
('step_004_2', 2, 'PRINCIPAL', 'PENDING', NULL, NULL, NOW(), 'req_004', NULL),
('step_004_3', 3, 'ADMIN', 'PENDING', NULL, NULL, NOW(), 'req_004', NULL);

-- Insert Approval Steps for req_005 (Approved)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_005_1', 1, 'HOD', 'APPROVED', 'Professional development is crucial', DATE_SUB(NOW(), INTERVAL 9 DAY), NOW(), 'req_005', 'user_hod_1'),
('step_005_2', 2, 'PRINCIPAL', 'APPROVED', 'Excellent opportunity for teacher growth', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW(), 'req_005', 'user_principal_1');

-- Insert Approval Steps for req_006 (Pending - in HOD stage)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_006_1', 1, 'HOD', 'ACTIVE', NULL, NULL, NOW(), 'req_006', NULL),
('step_006_2', 2, 'PRINCIPAL', 'PENDING', NULL, NULL, NOW(), 'req_006', NULL);

-- Insert Approval Steps for req_007 (Approved)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_007_1', 1, 'HOD', 'APPROVED', 'Sports equipment essential for physical education', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 'req_007', 'user_hod_2'),
('step_007_2', 2, 'PRINCIPAL', 'APPROVED', 'Approved. Purchase can proceed.', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), 'req_007', 'user_principal_1');

-- Insert Approval Steps for req_008 (Pending - in HOD stage)
INSERT INTO `ApprovalStep` (`id`, `stepOrder`, `approverRole`, `status`, `comment`, `actionedAt`, `createdAt`, `requestId`, `actionedById`) VALUES
('step_008_1', 1, 'HOD', 'ACTIVE', NULL, NULL, NOW(), 'req_008', NULL),
('step_008_2', 2, 'PRINCIPAL', 'PENDING', NULL, NULL, NOW(), 'req_008', NULL),
('step_008_3', 3, 'ADMIN', 'PENDING', NULL, NULL, NOW(), 'req_008', NULL);
