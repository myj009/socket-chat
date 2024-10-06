import * as z from "zod";

const jwtUser = z.object({
  userId: z.string(),
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtUser = z.infer<typeof jwtUser>;
