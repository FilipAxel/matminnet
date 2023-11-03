import { z } from "zod";

export const pagination = z.object({
  page: z.number(),
  pageSize: z.number(),
});

export type Pagination = z.TypeOf<typeof pagination>;
