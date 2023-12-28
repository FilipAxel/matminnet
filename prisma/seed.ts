import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const tags = [
    { name: "Middag", type: "meal" },
    { name: "Frukost", type: "meal" },
    { name: "Lunch", type: "meal" },
    { name: "Efterrätt", type: "meal" },
    { name: "Sallad", type: "meal" },
    { name: "Dryck", type: "meal" },
    { name: "Förrätt", type: "meal" },
    { name: "Tillbehör", type: "meal" },
    { name: "Cocktail", type: "meal" },
    { name: "Skaldjur", type: "meal" },
    { name: "pasta", type: "meal" },
    { name: "Soppa", type: "meal" },
    { name: "Pizza", type: "meal" },
    { name: "Taco", type: "meal" },
    { name: "Sushi", type: "meal" },
    { name: "Curry", type: "meal" },
    { name: "Vegetariskt", type: "diet" },
    { name: "Mjölkfritt", type: "diet" },
    { name: "Veganskt", type: "diet" },
    { name: "Pescetariskt", type: "diet" },
    { name: "Hälsosamt", type: "diet" },
    { name: "Högprotein", type: "diet" },
    { name: "Glutenfritt", type: "diet" },
    { name: "Fettfattigt", type: "diet" },
    { name: "Keto", type: "diet" },
    { name: "Lite socker", type: "diet" },
    { name: "Low carb", type: "diet" },
    { name: "Budgetvänlig", type: "other" },
    { name: "Barnvänlig", type: "other" },
    { name: "Kryddig", type: "other" },
    { name: "Snabbt", type: "other" },
    { name: "vardag", type: "other" },
    { name: "Helg", type: "other" },
    { name: "Tröstmat", type: "other" },
    { name: "Grillat", type: "other" },
    { name: "Ugnsbakat", type: "other" },
    { name: "Slow cooker", type: "other" },
    { name: "Picknick", type: "other" },
    { name: "Air fryer", type: "other" },
    { name: "Grilla", type: "other" },
  ];

  for (const tag of tags) {
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: tag.name,
      },
    });

    if (existingTag) {
      console.log(`Tag '${tag.name}' with type '${tag.type}' already exists.`);
    } else {
      await prisma.tag.create({
        data: {
          name: tag.name,
          type: tag.type,
        },
      });
    }
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
