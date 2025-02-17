import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const session = await event.locals.auth();
    console.log(session)
    if (session && event.url.pathname === "/login") {
      throw redirect(307, '/');
  }
    if (!session && event.url.pathname !== "/login") {
        throw redirect(307, '/login'); 
    }
    return { session };
};
