/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeIngredient` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dosageForm` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "activeIngredient" TEXT NOT NULL,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "dosageForm" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "strength" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");
