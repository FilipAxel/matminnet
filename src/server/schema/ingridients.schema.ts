import { z } from "zod";

export const ingredients = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
    quantity: z.string(),
    unit: z.string(),
  })
);

export type ingredients = z.TypeOf<typeof ingredients>;
