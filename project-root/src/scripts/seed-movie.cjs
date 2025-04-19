//src/scripts/seed-movie.cjs
"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedMovies() {
  const moviesData = [
    {
      name: "Movie1",
      length: 7200,
      rate: 8.5,
      image: "/images/76963db1e35df0f3c76b21ef7ab12f3db21c2b9e5d089f4d816c6c368c0f80cb.jpg", // 图片 URL 代替值
      description: "An epic journey through uncharted lands.",
    },
    {
      name: "Movie2",
      length: 5400,
      rate: 7.2,
      image: "/images/76963db1e35df0f3c76b21ef7ab12f3db21c2b9e5d089f4d816c6c368c0f80cb.jpg",
      description: "A heartwarming romantic story set in the City of Love.",
    },
    {
      name: "Movie3",
      length: 8400,
      rate: 9.0,
      image: "/images/cdb2a66d642ede4f089fb16fb11e566eb7cf0bdc976ae547151e203c013b81a9.jpg",
      description: "A mind-bending sci-fi adventure exploring the depths of space.",
    },
    {
        name: "Movie4",
        length: 8400,
        rate: 9.0,
        image: "/images/cdb2a66d642ede4f089fb16fb11e566eb7cf0bdc976ae547151e203c013b81a9.jpg",
        description: "A mind-bending sci-fi adventure exploring the depths of space.",
      },
      {
        name: "Movie5",
        length: 8400,
        rate: 9.0,
        image: "/images/faced91f9ec89b172ebcb3419d9653a52a195c9e619cb69fb49bce1c9220250c.jpg",
        description: "A mind-bending sci-fi adventure exploring the depths of space.",
      },
      {
        name: "Movie6",
        length: 8400,
        rate: 9.0,
        image: "/images/faced91f9ec89b172ebcb3419d9653a52a195c9e619cb69fb49bce1c9220250c.jpg",
        description: "A mind-bending sci-fi adventure exploring the depths of space.",
      },
  ];

  for (const movie of moviesData) {
    try {
      // check if movie repeated
      const existing = await prisma.movie.findFirst({ where: { name: movie.name } });
    //   if (!existing) {
    if(true){
        await prisma.movie.create({ data: movie });
        console.log(`Created movie: ${movie.name}`);
      } else {
        console.log(`Movie already exists: ${movie.name}`);
      }
    } catch (error) {
      console.error("Error seeding movie:", movie.name, error);
    }
  }
  
  await prisma.$disconnect();
}

seedMovies().catch((e) => {
  console.error("Seeding failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
