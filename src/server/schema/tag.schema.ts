import { z } from "zod";

export const tags = z.array(z.string());

export type Tags = z.TypeOf<typeof tags>;
