import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { env } from "process";
import { v4 as uuidv4 } from "uuid";
import { getCollection, updateCollectionImage } from "./collection.controller";
import { type Session } from "next-auth";
import { type IdSchema } from "../schema/recipe.schema";

export const bucketName = env.AWS_BUCKET_NAME || "";
export const cloudFrontUrl = env.CLOUDFRONT_URL || "";
export const region = env.AWS_BUCKET_REGION;
export const accessKeyId = env.AWS_MATMINNET_ACCESS_KEY || "";
export const secretAccessKey = env.AWS_SECRET_ACCESS_KEY || "";
export const cloudfrontDistributionId = env.CLOUDFRONT_DISTRIBUTION_ID;
export const UPLOAD_MAX_FILE_SIZE = 15000000; // 15 MB

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

const createPresignUrl = async (name: string) => {
  return createPresignedPost(s3Client, {
    Bucket: bucketName,
    Key: name,
    Fields: {
      key: name,
    },
    Expires: 60,
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
    ],
  });
};

export const deleteImageFromAws = async (name: string) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: name,
  };
  await s3Client.send(new DeleteObjectCommand(deleteParams));

  // Create CloudFront invalidation
  const cfCommand = new CreateInvalidationCommand({
    DistributionId: cloudfrontDistributionId,
    InvalidationBatch: {
      CallerReference: name,
      Paths: {
        Quantity: 1,
        Items: ["/" + name],
      },
    },
  });

  await cloudfront.send(cfCommand);
};

export const getSignedUrlAws = (name: string) => {
  return getSignedUrl({
    keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID as string,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
      /\\n/gm,
      "\n"
    ) as string,
    url: cloudFrontUrl + name,
    dateLessThan: new Date(
      Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/
    ).toString(),
  });
};

export const createPresignedUrlForCollection = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient; session: Session }
) => {
  const collection = await getCollection(input, ctx);

  if (!collection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "the collection does not exist",
    });
  }
  const imageName = await updateCollectionImage(collection, ctx);
  return await createPresignUrl(imageName);
};

export const createPresignedUrlForRecipe = async (
  input: IdSchema,
  ctx: { prisma: PrismaClient }
) => {
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

  return createPresignUrl(imageName);
};
