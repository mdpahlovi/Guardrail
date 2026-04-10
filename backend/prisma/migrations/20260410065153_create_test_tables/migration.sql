-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('mcq', 'essay', 'mixed');

-- CreateEnum
CREATE TYPE "QuestionInputType" AS ENUM ('text', 'radio', 'checkbox');

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalCandidates" INTEGER NOT NULL,
    "totalSlots" INTEGER NOT NULL,
    "questionSet" INTEGER NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "type" "QuestionInputType" NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 1,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT NOT NULL DEFAULT '',
    "correctAnswers" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "testId" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_createdById_idx" ON "test"("createdById");

-- CreateIndex
CREATE INDEX "question_testId_idx" ON "question"("testId");

-- CreateIndex
CREATE INDEX "option_questionId_idx" ON "option"("questionId");

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
