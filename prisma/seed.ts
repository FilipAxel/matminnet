import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const tags = [
    { name: "middag", type: "meal" },
    { name: "frukost", type: "meal" },
    { name: "lunch", type: "meal" },
    { name: "efterrätt", type: "meal" },
    { name: "sallad", type: "meal" },
    { name: "dryck", type: "meal" },
    { name: "förrätt", type: "meal" },
    { name: "tillbehör", type: "meal" },
    { name: "cocktail", type: "meal" },
    { name: "skaldjur", type: "meal" },
    { name: "pasta", type: "meal" },
    { name: "vegetarisk-pasta", type: "meal" },
    { name: "grillad-kyckling", type: "meal" },
    { name: "soppa", type: "meal" },
    { name: "pizza", type: "meal" },
    { name: "taco", type: "meal" },
    { name: "sushi", type: "meal" },
    { name: "curry", type: "meal" },
    { name: "vegetariskt", type: "diet" },
    { name: "mjölkfritt", type: "diet" },
    { name: "veganskt", type: "diet" },
    { name: "pescetariskt", type: "diet" },
    { name: "hälsosamt", type: "diet" },
    { name: "högprotein", type: "diet" },
    { name: "glutenfritt", type: "diet" },
    { name: "fettfattigt", type: "diet" },
    { name: "keto", type: "diet" },
    { name: "lite socker", type: "diet" },
    { name: "lite kolhydrater", type: "diet" },
    { name: "budgetvänlig", type: "other" },
    { name: "en-palett", type: "other" },
    { name: "barnvänlig", type: "other" },
    { name: "kryddig", type: "other" },
    { name: "snabbt", type: "other" },
    { name: "vardag", type: "other" },
    { name: "helg", type: "other" },
    { name: "tröstmat", type: "other" },
    { name: "grillat", type: "other" },
    { name: "ugnsbakat", type: "other" },
    { name: "slow cooker", type: "other" },
    { name: "picknick", type: "other" },
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
