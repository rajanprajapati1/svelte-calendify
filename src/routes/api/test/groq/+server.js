import { ActionFetcher } from "$lib/ActionFetcher.js";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  try {
    const command = event.url.searchParams.get("command");
    if (!command) {
      return json({ error: "No command parameter provided", newParam: command }, { status: 400 });
    }
    console.log("Received command:", command);
    const actiondd = await ActionFetcher(command);
    const results = actiondd?.choices[0]?.message?.content?.trim();
    if (results) {
      return json(results);
    } else {
      return json({ error: "No action determined from the input." }, { status: 400 });
    }
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
