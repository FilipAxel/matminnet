import { z } from "zod";

export const tags = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
  })
);

export type Tags = z.TypeOf<typeof tags>;
