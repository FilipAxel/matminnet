import { type Author, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { env } from "~/env.mjs";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const bucketName = env.AWS_BUCKET_NAME || "";
const cloudFrontUrl = env.CLOUDFRONT_URL || "";
const region = env.AWS_BUCKET_REGION;
const accessKeyId = env.AWS_MATMINNET_ACCESS_KEY || "";
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY || "";
const cloudfrontDistributionId = env.CLOUDFRONT_DISTRIBUTION_ID;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region,
});

export const recipeRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the recipe does not exist",
        });
      }

      const imageName = uuidv4();
      await ctx.prisma.recipe.update({
        where: {
          id: recipe.id,
        },
        data: {
          images: {
            create: {
              name: imageName,
            },
          },
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: bucketName,
        Key: imageName,
        Fields: {
          key: imageName,
        },
        Expires: 60,
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),

  getAllRecipes: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    if (!id) return;
    try {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          userId: id,
        },
        include: {
          images: {
            select: {
              name: true,
            },
          },
        },
      });

      if (recipes) {
        for (const recipe of recipes) {
          for (const image of recipe.images) {
            const signedUrl = getSignedUrl({
              keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
                /\\n/gm,
                "\n"
              ) as string,
              url: cloudFrontUrl + image.name,
              dateLessThan: new Date(
                Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
              ).toString(),
            });
            image.name = signedUrl;
          }
        }
      }

      return recipes;
    } catch (error) {
      console.log(error);
    }
  }),

  getApprovedPublication: publicProcedure.query(async ({ ctx }) => {
    try {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          publicationStatus: "published",
        },
        include: {
          images: {
            select: {
              name: true,
            },
          },
        },
      });

      for (const recipe of recipes) {
        for (const image of recipe.images) {
          const signedUrl = getSignedUrl({
            keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
              /\\n/gm,
              "\n"
            ) as string,
            url: cloudFrontUrl + image.name,
            dateLessThan: new Date(
              Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
            ).toString(),
          });
          image.name = signedUrl;
        }
      }
      return recipes;
    } catch (error) {}
  }),

  getRecipeWithCatalogId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const catalogId: string = input.id;

      try {
        const recipes = await ctx.prisma.recipe.findMany({
          where: {
            catalogs: {
              some: {
                catalog: {
                  id: catalogId,
                },
              },
            },
          },
          include: {
            images: {
              select: {
                name: true,
              },
            },
          },
        });
        for (const recipe of recipes) {
          for (const image of recipe.images) {
            const signedUrl = getSignedUrl({
              keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
              privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
                /\\n/gm,
                "\n"
              ) as string,
              url: cloudFrontUrl + image.name,
              dateLessThan: new Date(
                Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
              ).toString(),
            });
            image.name = signedUrl;
          }
        }
        return recipes;
      } catch (error) {}
    }),

  getRecipeWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const recipeId: string = input.id;
      const { session } = ctx;
      try {
        const recipe = await ctx.prisma.recipe.findFirst({
          where: {
            id: recipeId,
          },
          include: {
            author: true,
            images: {
              select: {
                name: true,
              },
            },
            RecipeIngredient: {
              include: {
                ingredient: true,
              },
            },
          },
        });

        if (
          recipe?.publicationStatus === "published" ||
          session.user.id === recipe?.userId
        ) {
          if (recipe?.images) {
            for (const image of recipe?.images) {
              const signedUrl = getSignedUrl({
                keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
                  /\\n/gm,
                  "\n"
                ) as string,
                url: cloudFrontUrl + image.name,
                dateLessThan: new Date(
                  Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
                ).toString(),
              });
              image.name = signedUrl;
            }
          }

          return recipe;
        }

        return null;
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to propagate it up the call stack
      }
    }),

  createRecipe: protectedProcedure
    .input(
      z.object({
        recipe: z.object({
          name: z.string(),
          description: z.string(),
          direction: z.string(),
          servingSize: z.string(),
          video: z.string(),
          country: z.string(),
          author: z.string(),
          catalog: z.object({
            value: z.string(),
            label: z.string(),
          }),
          ingredients: z.array(
            z.object({
              value: z.string(),
              label: z.string(),
              quantity: z.string(),
              unit: z.string(),
            })
          ),
          publicationStatus: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.session.user;
      const { recipe } = input;
      const {
        author,
        catalog,
        country,
        description,
        direction,
        ingredients,
        name,
        servingSize,
        video,
        publicationStatus,
      } = recipe;

      try {
        const authorFromDb = await ctx.prisma.author.findFirst({
          where: {
            name: author,
          },
        });

        const catalogFromDb = await ctx.prisma.catalog.findFirst({
          where: {
            name: catalog?.value,
          },
        });

        let createdAuthor: Author | null = null;
        if (!authorFromDb) {
          createdAuthor = await ctx.prisma.author.create({
            data: {
              name: author,
            },
          });
        }

        const recipeIngredients: {
          name: string;
          quantity: string;
          unit: string;
          ingredientId: string;
        }[] = [];
        for (const ingredient of ingredients) {
          const existingIngredient = await ctx.prisma.ingredient.findUnique({
            where: {
              name: ingredient.value,
            },
          });

          if (existingIngredient) {
            recipeIngredients.push({
              name: ingredient.value,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              ingredientId: existingIngredient.id,
            });
          } else {
            const newIngredient = await ctx.prisma.ingredient.create({
              data: {
                name: ingredient.value,
              },
            });

            recipeIngredients.push({
              name: ingredient.value,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              ingredientId: newIngredient.id,
            });
          }
        }

        const createdRecipe = await ctx.prisma.recipe.create({
          data: {
            name: name,
            description: description,
            direction: direction,
            country: country,
            servingSize: parseInt(servingSize),
            video: video,
            authorId: authorFromDb?.id || createdAuthor?.id,
            userId: id,
            catalogs: catalogFromDb
              ? {
                  create: {
                    catalog: {
                      connect: {
                        id: catalogFromDb.id,
                      },
                    },
                  },
                }
              : undefined,
            RecipeIngredient: {
              create: recipeIngredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                ingredient: {
                  connect: {
                    id: ingredient.ingredientId,
                  },
                },
              })),
            },
            publicationStatus: publicationStatus ? "unapproved" : "private",
          },
          include: {
            RecipeIngredient: true, // Include the created ingredients in the response
          },
        });

        if (publicationStatus) {
          await ctx.prisma.recipePublicationRequest.create({
            data: {
              recipeId: createdRecipe.id,
              userId: id,
            },
          });
        }

        return {
          status: "success",
          createdRecipe,
        };
      } catch (error) {
        throw error;
      }
    }),

  updateRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const recipe = await ctx.prisma.recipe.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
        });
        return {
          status: "success",
          data: {
            recipe,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Recipe with that ID not found",
            });
          }
        }
        throw error;
      }
    }),

  deleteRecipeWithId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const recipe = await ctx.prisma.recipe.delete({
          where: {
            id: input.id,
          },
          include: {
            images: {
              select: {
                name: true,
              },
            },
          },
        });

        const imageName = recipe?.images?.[0]?.name || "";

        if (imageName) {
          const deleteParams = {
            Bucket: bucketName,
            Key: imageName,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        const cfCommand = new CreateInvalidationCommand({
          DistributionId: cloudfrontDistributionId,
          InvalidationBatch: {
            CallerReference: imageName,
            Paths: {
              Quantity: 1,
              Items: ["/" + imageName],
            },
          },
        });

        await cloudfront.send(cfCommand);

        return {
          status: "success",
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Recipe with that ID not found",
            });
          }
        }
        throw error;
      }
    }),
});
