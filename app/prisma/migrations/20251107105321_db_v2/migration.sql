-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('EVENT', 'UNIVERSITY', 'PORTFOLIO', 'BLOG', 'BUSINESS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('HEADER', 'TEXT', 'BUTTON', 'IMAGE', 'CARD', 'COUNTDOWN', 'FORM', 'AGENDA', 'CAROUSEL', 'BULLET_LIST', 'TESTIMONIAL', 'GALLERY', 'SPEAKERS', 'COUNTER', 'NAVBAR', 'FOOTER', 'INNER_SECTION');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "category" "TemplateCategory" NOT NULL DEFAULT 'CUSTOM';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "darkMode" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isHome" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "pageId" TEXT,
    "templateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "type" "ComponentType" NOT NULL,
    "order" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalStyle" (
    "id" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "fontFamily" TEXT,
    "fontSize" TEXT,
    "breakpoints" JSONB,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionStyle" (
    "id" TEXT NOT NULL,
    "width" TEXT,
    "height" TEXT,
    "maxWidth" TEXT,
    "backgroundColor" TEXT,
    "backgroundImage" TEXT,
    "padding" JSONB,
    "margin" JSONB,
    "borderWidth" TEXT,
    "borderColor" TEXT,
    "borderRadius" TEXT,
    "borderStyle" TEXT,
    "boxShadow" TEXT,
    "opacity" DOUBLE PRECISION,
    "responsiveStyles" JSONB,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentStyle" (
    "id" TEXT NOT NULL,
    "width" TEXT,
    "height" TEXT,
    "backgroundColor" TEXT,
    "backgroundImage" TEXT,
    "fontSize" TEXT,
    "fontWeight" TEXT,
    "textColor" TEXT,
    "textAlign" TEXT,
    "lineHeight" TEXT,
    "padding" JSONB,
    "margin" JSONB,
    "borderWidth" TEXT,
    "borderColor" TEXT,
    "borderRadius" TEXT,
    "borderStyle" TEXT,
    "boxShadow" TEXT,
    "opacity" DOUBLE PRECISION,
    "animation" TEXT,
    "responsiveStyles" JSONB,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceScore" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "seoScore" DOUBLE PRECISION NOT NULL,
    "performanceScore" DOUBLE PRECISION NOT NULL,
    "accessibilityScore" DOUBLE PRECISION NOT NULL,
    "pageSize" INTEGER NOT NULL,
    "loadTime" DOUBLE PRECISION,
    "keywords" TEXT[],
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_websiteId_idx" ON "Page"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_websiteId_slug_key" ON "Page"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");

-- CreateIndex
CREATE INDEX "Section_templateId_idx" ON "Section"("templateId");

-- CreateIndex
CREATE INDEX "Section_order_idx" ON "Section"("order");

-- CreateIndex
CREATE INDEX "Component_sectionId_idx" ON "Component"("sectionId");

-- CreateIndex
CREATE INDEX "Component_order_idx" ON "Component"("order");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalStyle_websiteId_key" ON "GlobalStyle"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionStyle_sectionId_key" ON "SectionStyle"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentStyle_componentId_key" ON "ComponentStyle"("componentId");

-- CreateIndex
CREATE INDEX "Image_userId_idx" ON "Image"("userId");

-- CreateIndex
CREATE INDEX "PerformanceScore_websiteId_idx" ON "PerformanceScore"("websiteId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalStyle" ADD CONSTRAINT "GlobalStyle_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionStyle" ADD CONSTRAINT "SectionStyle_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentStyle" ADD CONSTRAINT "ComponentStyle_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
