-- DropIndex
DROP INDEX "option_questionId_idx";

-- DropIndex
DROP INDEX "question_testId_idx";

-- DropIndex
DROP INDEX "test_createdById_idx";

-- AlterTable
ALTER TABLE "test" ADD COLUMN     "negativeMarking" DOUBLE PRECISION NOT NULL DEFAULT 0.25;

-- CreateTable
CREATE TABLE "test_enrollment" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempt" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "isAutoSubmit" BOOLEAN NOT NULL DEFAULT false,
    "tabSwitches" INTEGER NOT NULL DEFAULT 0,
    "fullscreenExit" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "test_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textAnswer" TEXT,
    "chosen" TEXT[],

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_enrollment_testId_userId_key" ON "test_enrollment"("testId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "test_attempt_testId_userId_key" ON "test_attempt"("testId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "answer_attemptId_questionId_key" ON "answer"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "test_enrollment" ADD CONSTRAINT "test_enrollment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_enrollment" ADD CONSTRAINT "test_enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempt" ADD CONSTRAINT "test_attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "test_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
