/*
  Warnings:

  - Added the required column `tapNumber` to the `Tap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Tap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tap" ADD COLUMN     "tapNumber" INTEGER NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL;
