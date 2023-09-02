import { z } from "zod";

export const collections = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
  })
);

export const collection = z.object({
  name: z.string(),
  type: z.string(),
});

export const updateCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type collections = z.TypeOf<typeof collections>;
export type collection = z.TypeOf<typeof collection>;
export type updateCollectionSchema = z.TypeOf<typeof updateCollectionSchema>;
