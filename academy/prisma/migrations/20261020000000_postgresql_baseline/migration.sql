-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'instructor', 'admin', 'internal_instructor');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'banned');

-- CreateEnum
CREATE TYPE "InstructorApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ExaminingBody" AS ENUM ('zimsec', 'cambridge');

-- CreateEnum
CREATE TYPE "SubjectPackageStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('ZAR', 'USD', 'ZWL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('enrollment', 'payout', 'commission', 'refund', 'adjustment');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'succeeded', 'failed', 'reversed');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('course_complaint', 'user_report');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('open', 'reviewing', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'canceled');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('paid', 'open', 'void', 'uncollectible');

-- CreateEnum
CREATE TYPE "LiveLessonStatus" AS ENUM ('upcoming', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "HomeworkSubmissionStatus" AS ENUM ('not_submitted', 'submitted', 'graded');

-- CreateEnum
CREATE TYPE "ExamResourceKind" AS ENUM ('paper', 'memo');

-- CreateEnum
CREATE TYPE "ResourceKind" AS ENUM ('notes', 'study_resource', 'worksheet', 'recording');

-- CreateEnum
CREATE TYPE "SubjectEnrollmentStatus" AS ENUM ('pending', 'active', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('monthly');

-- CreateEnum
CREATE TYPE "TutorialStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "TutorialDifficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('learner', 'manager', 'administrator');

-- CreateEnum
CREATE TYPE "SubjectQuizQuestionType" AS ENUM ('multiple_choice', 'short_answer');

-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36),
    "emailHash" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "moderationNote" TEXT,
    "instructorId" CHAR(36) NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "categoryId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" CHAR(36) NOT NULL,
    "organizationId" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL DEFAULT 'learner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAssignment" (
    "id" CHAR(36) NOT NULL,
    "organizationId" CHAR(36) NOT NULL,
    "courseId" CHAR(36) NOT NULL,
    "assignedById" CHAR(36) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "required" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" CHAR(36) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "sectionId" CHAR(36) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "courseId" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "courseId" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorApplication" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "status" "InstructorApplicationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" CHAR(36),
    "notes" TEXT,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "expertise" TEXT,
    "yearsExperience" INTEGER,
    "certifications" TEXT,
    "biography" TEXT,
    "sampleCourseProposal" TEXT,
    "preferredCategorySlugs" JSONB NOT NULL DEFAULT '[]',
    "resumeFileName" TEXT,
    "resumeFileType" TEXT,
    "resumeFileSize" INTEGER,
    "resumeData" BYTEA,

    CONSTRAINT "InstructorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" CHAR(36) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'succeeded',
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "amount" INTEGER NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "userId" CHAR(36),
    "courseId" CHAR(36),
    "enrollmentId" CHAR(36),
    "subjectPackageId" CHAR(36),
    "providerPollUrl" TEXT,
    "providerReference" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" CHAR(36) NOT NULL,
    "type" "ReportType" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "reporterId" CHAR(36) NOT NULL,
    "courseId" CHAR(36),
    "accusedUserId" CHAR(36),
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolverId" CHAR(36),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" CHAR(36) NOT NULL,
    "certificateId" TEXT NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "courseId" CHAR(36) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementDefinition" (
    "id" CHAR(36) NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "achievementId" CHAR(36) NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "planName" TEXT NOT NULL DEFAULT 'Free',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "amount" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'open',
    "reference" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveLesson" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" INTEGER,
    "status" "LiveLessonStatus" NOT NULL DEFAULT 'upcoming',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "meetingLink" TEXT,
    "recordingUrl" TEXT,
    "teacherId" CHAR(36) NOT NULL,
    "categoryId" CHAR(36),
    "subjectPackageId" CHAR(36),
    "courseId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" CHAR(36) NOT NULL,
    "liveLessonId" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkAssignment" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "teacherId" CHAR(36) NOT NULL,
    "subjectPackageId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeworkAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkSubmission" (
    "id" CHAR(36) NOT NULL,
    "assignmentId" CHAR(36) NOT NULL,
    "studentId" CHAR(36) NOT NULL,
    "status" "HomeworkSubmissionStatus" NOT NULL DEFAULT 'not_submitted',
    "answerText" TEXT,
    "fileUrl" TEXT,
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeworkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResource" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "ExamResourceKind" NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "term" INTEGER,
    "examType" TEXT,
    "fileUrl" TEXT,
    "subjectPackageId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "ResourceKind" NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "fileUrl" TEXT,
    "subjectPackageId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "grade" INTEGER,
    "subject" TEXT,
    "authorId" CHAR(36) NOT NULL,
    "subjectPackageId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectPackage" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "term" INTEGER,
    "price" INTEGER NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "billingPeriod" "BillingPeriod" NOT NULL DEFAULT 'monthly',
    "isCapsAligned" BOOLEAN NOT NULL DEFAULT true,
    "examiningBody" "ExaminingBody" NOT NULL DEFAULT 'zimsec',
    "includesLiveLessons" BOOLEAN NOT NULL DEFAULT true,
    "isExamPrep" BOOLEAN NOT NULL DEFAULT false,
    "isHolidayLearning" BOOLEAN NOT NULL DEFAULT false,
    "status" "SubjectPackageStatus" NOT NULL DEFAULT 'approved',
    "moderationNote" TEXT,
    "teacherId" CHAR(36),
    "categoryId" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectSection" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "subjectPackageId" CHAR(36) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectLesson" (
    "id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "sectionId" CHAR(36) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectLessonProgress" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectQuiz" (
    "id" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectQuizQuestion" (
    "id" CHAR(36) NOT NULL,
    "quizId" CHAR(36) NOT NULL,
    "type" "SubjectQuizQuestionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "options" JSONB,
    "correctOption" INTEGER,

    CONSTRAINT "SubjectQuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectQuizAttempt" (
    "id" CHAR(36) NOT NULL,
    "quizId" CHAR(36) NOT NULL,
    "studentId" CHAR(36) NOT NULL,
    "score" INTEGER,
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectQuizAnswer" (
    "id" CHAR(36) NOT NULL,
    "attemptId" CHAR(36) NOT NULL,
    "questionId" CHAR(36) NOT NULL,
    "selectedOption" INTEGER,
    "textAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "reviewerFeedback" TEXT,

    CONSTRAINT "SubjectQuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectEnrollment" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "subjectPackageId" CHAR(36) NOT NULL,
    "status" "SubjectEnrollmentStatus" NOT NULL DEFAULT 'pending',
    "grade" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "billingPeriod" "BillingPeriod" NOT NULL DEFAULT 'monthly',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitEvent" (
    "id" CHAR(36) NOT NULL,
    "action" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutorial" (
    "id" CHAR(36) NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "imageUrl" TEXT,
    "difficulty" "TutorialDifficulty" NOT NULL DEFAULT 'beginner',
    "estimatedDuration" INTEGER NOT NULL,
    "status" "TutorialStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdById" CHAR(36),
    "updatedById" CHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "learningObjectives" JSONB,
    "targetAudience" TEXT,
    "prerequisites" TEXT,
    "category" TEXT,
    "tags" JSONB,
    "language" TEXT NOT NULL DEFAULT 'English',
    "courseType" TEXT NOT NULL DEFAULT 'FREE',
    "ownerName" TEXT NOT NULL DEFAULT 'Duradata Academy',
    "finalProject" JSONB,
    "sourceReferences" JSONB,
    "managedKey" TEXT,
    "managedVersion" INTEGER,

    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialSection" (
    "id" CHAR(36) NOT NULL,
    "tutorialId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TutorialSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialLesson" (
    "id" CHAR(36) NOT NULL,
    "sectionId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 10,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorialLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialCodeExample" (
    "id" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "expectedOutput" TEXT,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TutorialCodeExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialExercise" (
    "id" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "starterCode" TEXT,
    "expectedAnswer" TEXT,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TutorialExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialQuiz" (
    "id" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "TutorialQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialQuizQuestion" (
    "id" CHAR(36) NOT NULL,
    "quizId" CHAR(36) NOT NULL,
    "prompt" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "explanation" TEXT,

    CONSTRAINT "TutorialQuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialQuizOption" (
    "id" CHAR(36) NOT NULL,
    "questionId" CHAR(36) NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TutorialQuizOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialProgress" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tutorialId" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorialProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialBookmark" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tutorialId" CHAR(36) NOT NULL,
    "lessonId" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorialBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialEnrollment" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tutorialId" CHAR(36) NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TutorialEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialQuizAttempt" (
    "id" CHAR(36) NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "quizId" CHAR(36) NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorialQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialCertificate" (
    "id" CHAR(36) NOT NULL,
    "certificateId" TEXT NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "tutorialId" CHAR(36) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorialCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_createdAt_idx" ON "User"("role", "status", "createdAt");

-- CreateIndex
CREATE INDEX "User_status_name_idx" ON "User"("status", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_revokedAt_expiresAt_idx" ON "Session"("userId", "revokedAt", "expiresAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_createdAt_idx" ON "PasswordResetToken"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_emailHash_createdAt_idx" ON "PasswordResetRequest"("emailHash", "createdAt");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_ipHash_createdAt_idx" ON "PasswordResetRequest"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_createdAt_idx" ON "PasswordResetRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Course_status_createdAt_idx" ON "Course"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Course_status_updatedAt_idx" ON "Course"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "Course_categoryId_status_title_idx" ON "Course"("categoryId", "status", "title");

-- CreateIndex
CREATE INDEX "Course_instructorId_status_updatedAt_idx" ON "Course"("instructorId", "status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_active_name_idx" ON "Organization"("active", "name");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_role_idx" ON "OrganizationMember"("userId", "role");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_createdAt_idx" ON "OrganizationMember"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "CourseAssignment_courseId_dueAt_idx" ON "CourseAssignment"("courseId", "dueAt");

-- CreateIndex
CREATE INDEX "CourseAssignment_organizationId_createdAt_idx" ON "CourseAssignment"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAssignment_organizationId_courseId_key" ON "CourseAssignment"("organizationId", "courseId");

-- CreateIndex
CREATE INDEX "Enrollment_createdAt_idx" ON "Enrollment"("createdAt");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_createdAt_idx" ON "Enrollment"("courseId", "createdAt");

-- CreateIndex
CREATE INDEX "Enrollment_userId_createdAt_idx" ON "Enrollment"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON "Progress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_courseId_key" ON "Favorite"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InstructorApplication_userId_key" ON "InstructorApplication"("userId");

-- CreateIndex
CREATE INDEX "InstructorApplication_status_createdAt_idx" ON "InstructorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_userId_status_createdAt_idx" ON "Transaction"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_subjectPackageId_status_idx" ON "Transaction"("subjectPackageId", "status");

-- CreateIndex
CREATE INDEX "Transaction_status_type_createdAt_idx" ON "Transaction"("status", "type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_enrollmentId_type_key" ON "Transaction"("enrollmentId", "type");

-- CreateIndex
CREATE INDEX "Report_status_type_createdAt_idx" ON "Report"("status", "type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateId_key" ON "Certificate"("certificateId");

-- CreateIndex
CREATE INDEX "Certificate_userId_issuedAt_idx" ON "Certificate"("userId", "issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementDefinition_code_key" ON "AchievementDefinition"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Invoice_userId_issuedAt_idx" ON "Invoice"("userId", "issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_userId_reference_key" ON "Invoice"("userId", "reference");

-- CreateIndex
CREATE INDEX "LiveLesson_startsAt_idx" ON "LiveLesson"("startsAt");

-- CreateIndex
CREATE INDEX "LiveLesson_grade_subject_idx" ON "LiveLesson"("grade", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_liveLessonId_userId_key" ON "Attendance"("liveLessonId", "userId");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_dueAt_idx" ON "HomeworkAssignment"("dueAt");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_grade_subject_idx" ON "HomeworkAssignment"("grade", "subject");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_teacherId_dueAt_idx" ON "HomeworkAssignment"("teacherId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkSubmission_assignmentId_studentId_key" ON "HomeworkSubmission"("assignmentId", "studentId");

-- CreateIndex
CREATE INDEX "ExamResource_grade_subject_year_idx" ON "ExamResource"("grade", "subject", "year");

-- CreateIndex
CREATE INDEX "SubjectPackage_grade_subject_idx" ON "SubjectPackage"("grade", "subject");

-- CreateIndex
CREATE INDEX "SubjectPackage_term_idx" ON "SubjectPackage"("term");

-- CreateIndex
CREATE INDEX "SubjectPackage_status_updatedAt_idx" ON "SubjectPackage"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectLessonProgress_userId_lessonId_key" ON "SubjectLessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectQuiz_lessonId_key" ON "SubjectQuiz"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectQuizAttempt_quizId_studentId_key" ON "SubjectQuizAttempt"("quizId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectQuizAnswer_attemptId_questionId_key" ON "SubjectQuizAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "SubjectEnrollment_status_idx" ON "SubjectEnrollment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectEnrollment_userId_subjectPackageId_key" ON "SubjectEnrollment"("userId", "subjectPackageId");

-- CreateIndex
CREATE INDEX "RateLimitEvent_action_keyHash_createdAt_idx" ON "RateLimitEvent"("action", "keyHash", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitEvent_createdAt_idx" ON "RateLimitEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_managedKey_key" ON "Tutorial"("managedKey");

-- CreateIndex
CREATE INDEX "Tutorial_status_publishedAt_idx" ON "Tutorial"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Tutorial_courseType_status_title_idx" ON "Tutorial"("courseType", "status", "title");

-- CreateIndex
CREATE INDEX "Tutorial_status_difficulty_title_idx" ON "Tutorial"("status", "difficulty", "title");

-- CreateIndex
CREATE INDEX "TutorialSection_tutorialId_order_idx" ON "TutorialSection"("tutorialId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialSection_tutorialId_slug_key" ON "TutorialSection"("tutorialId", "slug");

-- CreateIndex
CREATE INDEX "TutorialLesson_sectionId_order_idx" ON "TutorialLesson"("sectionId", "order");

-- CreateIndex
CREATE INDEX "TutorialLesson_isPublished_idx" ON "TutorialLesson"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialLesson_sectionId_slug_key" ON "TutorialLesson"("sectionId", "slug");

-- CreateIndex
CREATE INDEX "TutorialCodeExample_lessonId_order_idx" ON "TutorialCodeExample"("lessonId", "order");

-- CreateIndex
CREATE INDEX "TutorialExercise_lessonId_order_idx" ON "TutorialExercise"("lessonId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialQuiz_lessonId_key" ON "TutorialQuiz"("lessonId");

-- CreateIndex
CREATE INDEX "TutorialQuizQuestion_quizId_order_idx" ON "TutorialQuizQuestion"("quizId", "order");

-- CreateIndex
CREATE INDEX "TutorialQuizOption_questionId_order_idx" ON "TutorialQuizOption"("questionId", "order");

-- CreateIndex
CREATE INDEX "TutorialProgress_userId_tutorialId_lastViewedAt_idx" ON "TutorialProgress"("userId", "tutorialId", "lastViewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialProgress_userId_lessonId_key" ON "TutorialProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "TutorialBookmark_userId_tutorialId_idx" ON "TutorialBookmark"("userId", "tutorialId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialBookmark_userId_lessonId_key" ON "TutorialBookmark"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "TutorialEnrollment_tutorialId_completedAt_idx" ON "TutorialEnrollment"("tutorialId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialEnrollment_userId_tutorialId_key" ON "TutorialEnrollment"("userId", "tutorialId");

-- CreateIndex
CREATE INDEX "TutorialQuizAttempt_userId_quizId_createdAt_idx" ON "TutorialQuizAttempt"("userId", "quizId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialCertificate_certificateId_key" ON "TutorialCertificate"("certificateId");

-- CreateIndex
CREATE INDEX "TutorialCertificate_userId_issuedAt_idx" ON "TutorialCertificate"("userId", "issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialCertificate_userId_tutorialId_key" ON "TutorialCertificate"("userId", "tutorialId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorApplication" ADD CONSTRAINT "InstructorApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorApplication" ADD CONSTRAINT "InstructorApplication_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_accusedUserId_fkey" FOREIGN KEY ("accusedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "AchievementDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveLesson" ADD CONSTRAINT "LiveLesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveLesson" ADD CONSTRAINT "LiveLesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveLesson" ADD CONSTRAINT "LiveLesson_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveLesson" ADD CONSTRAINT "LiveLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_liveLessonId_fkey" FOREIGN KEY ("liveLessonId") REFERENCES "LiveLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkAssignment" ADD CONSTRAINT "HomeworkAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkAssignment" ADD CONSTRAINT "HomeworkAssignment_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkSubmission" ADD CONSTRAINT "HomeworkSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "HomeworkAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkSubmission" ADD CONSTRAINT "HomeworkSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResource" ADD CONSTRAINT "ExamResource_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPackage" ADD CONSTRAINT "SubjectPackage_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPackage" ADD CONSTRAINT "SubjectPackage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectSection" ADD CONSTRAINT "SubjectSection_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectLesson" ADD CONSTRAINT "SubjectLesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SubjectSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectLessonProgress" ADD CONSTRAINT "SubjectLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectLessonProgress" ADD CONSTRAINT "SubjectLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "SubjectLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuiz" ADD CONSTRAINT "SubjectQuiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "SubjectLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuizQuestion" ADD CONSTRAINT "SubjectQuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "SubjectQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuizAttempt" ADD CONSTRAINT "SubjectQuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "SubjectQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuizAttempt" ADD CONSTRAINT "SubjectQuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuizAnswer" ADD CONSTRAINT "SubjectQuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "SubjectQuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuizAnswer" ADD CONSTRAINT "SubjectQuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SubjectQuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectEnrollment" ADD CONSTRAINT "SubjectEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectEnrollment" ADD CONSTRAINT "SubjectEnrollment_subjectPackageId_fkey" FOREIGN KEY ("subjectPackageId") REFERENCES "SubjectPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialSection" ADD CONSTRAINT "TutorialSection_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialLesson" ADD CONSTRAINT "TutorialLesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TutorialSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialCodeExample" ADD CONSTRAINT "TutorialCodeExample_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "TutorialLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialExercise" ADD CONSTRAINT "TutorialExercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "TutorialLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialQuiz" ADD CONSTRAINT "TutorialQuiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "TutorialLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialQuizQuestion" ADD CONSTRAINT "TutorialQuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "TutorialQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialQuizOption" ADD CONSTRAINT "TutorialQuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TutorialQuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialProgress" ADD CONSTRAINT "TutorialProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialProgress" ADD CONSTRAINT "TutorialProgress_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialProgress" ADD CONSTRAINT "TutorialProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "TutorialLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialBookmark" ADD CONSTRAINT "TutorialBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialBookmark" ADD CONSTRAINT "TutorialBookmark_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialBookmark" ADD CONSTRAINT "TutorialBookmark_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "TutorialLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialEnrollment" ADD CONSTRAINT "TutorialEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialEnrollment" ADD CONSTRAINT "TutorialEnrollment_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialQuizAttempt" ADD CONSTRAINT "TutorialQuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialQuizAttempt" ADD CONSTRAINT "TutorialQuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "TutorialQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialCertificate" ADD CONSTRAINT "TutorialCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialCertificate" ADD CONSTRAINT "TutorialCertificate_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Persist the required Academy learning-mode defaults in every new database.
INSERT INTO "PlatformSetting" ("key", "value", "updatedAt") VALUES
  ('platformName', 'Duradata Academy', CURRENT_TIMESTAMP),
  ('supportEmail', 'academy@duradata.co.za', CURRENT_TIMESTAMP),
  ('academicLearningEnabled', 'false', CURRENT_TIMESTAMP),
  ('corporateLearningEnabled', 'true', CURRENT_TIMESTAMP),
  ('freeLearningEnabled', 'true', CURRENT_TIMESTAMP);

