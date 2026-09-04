import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Modifica questa lista con i nomi reali della tua lega.
const GIOCATORI = [
  { name: "Mario Rossi", emoji: "🦁", team: "I Leoni da Divano" },
  { name: "Luca Bianchi", emoji: "🐢", team: "Tartarughe Ninja FC" },
  { name: "Giulia Verdi", emoji: "🔥", team: "Fenomeni da Bar" },
];

async function main() {
  for (const g of GIOCATORI) {
    await prisma.player.upsert({
      where: { name: g.name },
      update: {},
      create: { name: g.name, slug: slugify(g.name), emoji: g.emoji, team: g.team },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
