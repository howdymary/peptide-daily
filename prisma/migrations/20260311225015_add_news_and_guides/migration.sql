-- CreateTable
CREATE TABLE "news_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "feed_url" TEXT NOT NULL,
    "feed_type" TEXT NOT NULL DEFAULT 'rss',
    "site_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "robots_txt_allows" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_ms" INTEGER NOT NULL DEFAULT 5000,
    "description" TEXT,
    "last_fetched_at" TIMESTAMP(3),
    "last_fetch_status" TEXT,
    "last_fetch_error" TEXT,
    "fetch_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "excerpt" TEXT,
    "author" TEXT,
    "published_at" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_editors_pick" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "reading_time" INTEGER NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_name_key" ON "news_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_slug_key" ON "news_sources"("slug");

-- CreateIndex
CREATE INDEX "news_sources_is_active_idx" ON "news_sources"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_source_url_key" ON "news_articles"("source_url");

-- CreateIndex
CREATE INDEX "news_articles_source_id_idx" ON "news_articles"("source_id");

-- CreateIndex
CREATE INDEX "news_articles_published_at_idx" ON "news_articles"("published_at" DESC);

-- CreateIndex
CREATE INDEX "news_articles_is_hidden_idx" ON "news_articles"("is_hidden");

-- CreateIndex
CREATE INDEX "news_articles_is_editors_pick_idx" ON "news_articles"("is_editors_pick");

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_category_idx" ON "guides"("category");

-- CreateIndex
CREATE INDEX "guides_is_published_idx" ON "guides"("is_published");

-- AddForeignKey
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "news_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
