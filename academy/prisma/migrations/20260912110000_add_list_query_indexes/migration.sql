CREATE INDEX `User_role_status_createdAt_idx` ON `User`(`role`, `status`, `createdAt`);
CREATE INDEX `User_status_name_idx` ON `User`(`status`, `name`);

CREATE INDEX `Course_status_createdAt_idx` ON `Course`(`status`, `createdAt`);
CREATE INDEX `Course_status_updatedAt_idx` ON `Course`(`status`, `updatedAt`);
CREATE INDEX `Course_categoryId_status_title_idx` ON `Course`(`categoryId`, `status`, `title`);
CREATE INDEX `Course_instructorId_status_updatedAt_idx` ON `Course`(`instructorId`, `status`, `updatedAt`);

CREATE INDEX `OrganizationMember_organizationId_createdAt_idx` ON `OrganizationMember`(`organizationId`, `createdAt`);
CREATE INDEX `CourseAssignment_organizationId_createdAt_idx` ON `CourseAssignment`(`organizationId`, `createdAt`);

CREATE INDEX `Enrollment_createdAt_idx` ON `Enrollment`(`createdAt`);
CREATE INDEX `Enrollment_courseId_createdAt_idx` ON `Enrollment`(`courseId`, `createdAt`);
CREATE INDEX `Enrollment_userId_createdAt_idx` ON `Enrollment`(`userId`, `createdAt`);

CREATE INDEX `InstructorApplication_status_createdAt_idx` ON `InstructorApplication`(`status`, `createdAt`);
CREATE INDEX `Transaction_status_type_createdAt_idx` ON `Transaction`(`status`, `type`, `createdAt`);
CREATE INDEX `Report_status_type_createdAt_idx` ON `Report`(`status`, `type`, `createdAt`);
CREATE INDEX `Certificate_userId_issuedAt_idx` ON `Certificate`(`userId`, `issuedAt`);
CREATE INDEX `Notification_userId_createdAt_idx` ON `Notification`(`userId`, `createdAt`);
CREATE INDEX `HomeworkAssignment_teacherId_dueAt_idx` ON `HomeworkAssignment`(`teacherId`, `dueAt`);
CREATE INDEX `SubjectPackage_status_updatedAt_idx` ON `SubjectPackage`(`status`, `updatedAt`);
CREATE INDEX `Tutorial_courseType_status_title_idx` ON `Tutorial`(`courseType`, `status`, `title`);
CREATE INDEX `Tutorial_status_difficulty_title_idx` ON `Tutorial`(`status`, `difficulty`, `title`);
CREATE INDEX `TutorialCertificate_userId_issuedAt_idx` ON `TutorialCertificate`(`userId`, `issuedAt`);
