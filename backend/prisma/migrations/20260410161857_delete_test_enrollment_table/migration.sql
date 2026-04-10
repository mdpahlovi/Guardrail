/*
  Warnings:

  - You are about to drop the `test_enrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "test_enrollment" DROP CONSTRAINT "test_enrollment_testId_fkey";

-- DropForeignKey
ALTER TABLE "test_enrollment" DROP CONSTRAINT "test_enrollment_userId_fkey";

-- DropTable
DROP TABLE "test_enrollment";
