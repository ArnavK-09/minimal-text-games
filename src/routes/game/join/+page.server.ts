// imports 
import { ZodError, z, type ZodInvalidStringIssue } from "zod";
import type { PageServerLoad, Actions } from "../join/$types.js";
import { fail, redirect } from "@sveltejs/kit";

// Action to check game server code 
export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const code = data.get('code');
    const uuidSchema = z.string().uuid();
    try {
      uuidSchema.parse(code)
    } catch (e) {
      return fail(400, {
        error: "Invalid UUID Provided for Starting new game...."
      })
    }
    return redirect(301, `/game/${code}`)
  },
};