-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "University" ALTER COLUMN "createdAt" DROP NOT NULL;
