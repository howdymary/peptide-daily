-- CreateEnum
CREATE TYPE "FinnrickGrade" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateTable
CREATE TABLE "finnrick_vendor_ratings" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "peptide_id" TEXT NOT NULL,
    "grade" "FinnrickGrade" NOT NULL,
    "average_score" DECIMAL(4,1) NOT NULL,
    "test_count" INTEGER NOT NULL,
    "min_score" DECIMAL(4,1) NOT NULL,
    "max_score" DECIMAL(4,1) NOT NULL,
    "oldest_test_date" TIMESTAMP(3) NOT NULL,
    "newest_test_date" TIMESTAMP(3) NOT NULL,
    "finnrick_url" TEXT,
    "import_batch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finnrick_vendor_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finnrick_test_results" (
    "id" TEXT NOT NULL,
    "rating_id" TEXT NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL,
    "test_score" DECIMAL(4,1) NOT NULL,
    "advertised_quantity" DECIMAL(8,2) NOT NULL,
    "actual_quantity" DECIMAL(8,2) NOT NULL,
    "quantity_variance" DECIMAL(6,2) NOT NULL,
    "purity" DECIMAL(5,2) NOT NULL,
    "batch_id" TEXT NOT NULL,
    "container_type" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "endotoxins_status" TEXT,
    "certificate_link" TEXT,
    "identity_result" TEXT NOT NULL,
    "import_batch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finnrick_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finnrick_imports" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "record_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    "imported_by" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "finnrick_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_mappings" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "finnrick_slug" TEXT NOT NULL,
    "vendor_domain" TEXT,
    "scraping_enabled" BOOLEAN NOT NULL DEFAULT false,
    "scraping_adapter" TEXT,
    "rate_limit" INTEGER NOT NULL DEFAULT 10,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "finnrick_vendor_ratings_peptide_id_idx" ON "finnrick_vendor_ratings"("peptide_id");

-- CreateIndex
CREATE INDEX "finnrick_vendor_ratings_vendor_id_idx" ON "finnrick_vendor_ratings"("vendor_id");

-- CreateIndex
CREATE INDEX "finnrick_vendor_ratings_grade_idx" ON "finnrick_vendor_ratings"("grade");

-- CreateIndex
CREATE INDEX "finnrick_vendor_ratings_average_score_idx" ON "finnrick_vendor_ratings"("average_score");

-- CreateIndex
CREATE UNIQUE INDEX "finnrick_vendor_ratings_vendor_id_peptide_id_key" ON "finnrick_vendor_ratings"("vendor_id", "peptide_id");

-- CreateIndex
CREATE INDEX "finnrick_test_results_rating_id_idx" ON "finnrick_test_results"("rating_id");

-- CreateIndex
CREATE INDEX "finnrick_test_results_test_date_idx" ON "finnrick_test_results"("test_date");

-- CreateIndex
CREATE INDEX "finnrick_imports_status_idx" ON "finnrick_imports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_mappings_vendor_id_key" ON "vendor_mappings"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_mappings_finnrick_slug_key" ON "vendor_mappings"("finnrick_slug");

-- CreateIndex
CREATE INDEX "vendor_mappings_finnrick_slug_idx" ON "vendor_mappings"("finnrick_slug");

-- CreateIndex
CREATE INDEX "vendor_mappings_vendor_domain_idx" ON "vendor_mappings"("vendor_domain");

-- AddForeignKey
ALTER TABLE "finnrick_vendor_ratings" ADD CONSTRAINT "finnrick_vendor_ratings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finnrick_vendor_ratings" ADD CONSTRAINT "finnrick_vendor_ratings_peptide_id_fkey" FOREIGN KEY ("peptide_id") REFERENCES "peptides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finnrick_test_results" ADD CONSTRAINT "finnrick_test_results_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "finnrick_vendor_ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_mappings" ADD CONSTRAINT "vendor_mappings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
