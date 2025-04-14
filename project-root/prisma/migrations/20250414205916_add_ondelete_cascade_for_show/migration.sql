-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_movieID_fkey";

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieID_fkey" FOREIGN KEY ("movieID") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
