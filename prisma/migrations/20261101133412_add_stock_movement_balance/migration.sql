/*
  Warnings:

  - Added the required column `quantityAfter` to the `StockMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityBefore` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "quantityAfter" INTEGER NOT NULL,
ADD COLUMN     "quantityBefore" INTEGER NOT NULL;
