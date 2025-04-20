"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config(); // 加载 .env 文件

const useCDN = process.env.USE_CDN === "true";
const cdnPrefix = process.env.CDN_URL ?? "";
const localPrefix = "/images";

async function seedMovies() {
  const baseImage1 = "76963db1e35df0f3c76b21ef7ab12f3db21c2b9e5d089f4d816c6c368c0f80cb.jpg";
  const baseImage2 = "cdb2a66d642ede4f089fb16fb11e566eb7cf0bdc976ae547151e203c013b81a9.jpg";
  const baseImage3 = "0caf3c3ea9aa5c9fe25b9a06ab5062beff2400fa01c53943f3b46b8df72d9636.jpg";
  const baseImage4 = "faced91f9ec89b172ebcb3419d9653a52a195c9e619cb69fb49bce1c9220250c.jpg";
  const baseImage5 = "8a59859cdc0d349fd3b8ab8ce81ff24eb87dd653fb8a435d18c91df9fa46c05f.jpg";
  const baseImage6 = "9fcafa4e4c03f3a8c7b31e1a3b6e71f014da09a42004db563bdfe2619d748d8b.jpg";
  const baseImage7 = "e5daa99494fd0ca232c8e9b86a05ee0fa7e2c0551b28ed64228f6b179c683c94.jpg";

  const getImageUrl = (file) => useCDN ? `${cdnPrefix}/${file}` : `${localPrefix}/${file}`;

  const moviesData = [
    {
      name: "Echoes of Tomorrow",
      length: 7200,
      rate: 8.5,
      image: getImageUrl(baseImage1),
      description: "In a world where memories can be traded like currency, a memory thief stumbles upon a future she was never meant to see — and must choose between rewriting the past or saving the world from a repeating catastrophe.",
    },
    {
      name: "The Last Library",
      length: 5400,
      rate: 7.2,
      image: getImageUrl(baseImage2),
      description: "After a global blackout erases all digital knowledge, a reclusive librarian protects the only remaining printed books, becoming an unlikely hero in humanity’s quest to remember its past.",
    },
    {
      name: "Neon Dust",
      length: 8400,
      rate: 8.8,
      image: getImageUrl(baseImage3),
      description: "Set in a dystopian desert city, a retired bounty hunter is dragged back into the underworld when a rogue AI seeks refuge in his mind — blurring the line between man and machine.",
    },
    {
      name: "Between the Tides",
      length: 7800,
      rate: 8.2,
      image: getImageUrl(baseImage4),
      description: "A grieving marine biologist returns to her coastal hometown and discovers a child who can breathe underwater — unraveling secrets that could change the course of evolution.",
    },
    {
      name: "Starlight Sonata",
      length: 6600,
      rate: 8.7,
      image: getImageUrl(baseImage5),
      description: "When an aging pianist begins to lose his hearing, he composes one final symphony inspired by the stars, uniting strangers across the globe through a mysterious radio signal.",
    },
    {
      name: "Shadow Cartel",
      length: 7500,
      rate: 8.9,
      image: getImageUrl(baseImage6),
      description: "An undercover agent infiltrates a powerful international syndicate that manipulates global events through social media — but finds himself sympathizing with their cause the deeper he goes.",
    },
    {
      name: "The Forgotten City",
      length: 9000,
      rate: 7.5,
      image: getImageUrl(baseImage7),
      description: "In a city where memories are bought and sold, a detective must solve the mystery of his own erased past while navigating a web of deceit and betrayal.",
    },
  ];

  for (const movie of moviesData) {
    try {
      const existing = await prisma.movie.findFirst({ where: { name: movie.name } });
      if (!existing) {
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
