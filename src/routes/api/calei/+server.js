import { handleCalendarAction } from "$lib/langchainhandler.js";

export async function POST(event) {
  return await handleCalendarAction(event);
}
