import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { json } from "@sveltejs/kit";
import { GROQ_API_KEY } from "$env/static/private";
import { google } from "googleapis";
import { VIEW_EVENTS_PROMPT } from "../../../prompts/VIEW_EVENTS_PROMPT.js";
import { HTML_BEAUTIFY_PROMPT } from "../../../prompts/HTML_BEAUTIFY_PROMPT .js";
import { CREATE_EVENT_PROMPT } from "../../../prompts/CREATE_EVENT_PROMPT .js";
import { extractJson } from "../../../utils/Parser.js";

const model = new ChatGroq({ apiKey: GROQ_API_KEY });



export async function GET(event) {
  const session = await event.locals.getSession();
  if (!session || !session.user) {
    return json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = session?.access_token;
  if (!accessToken) {
    return json({ error: "No access token" }, { status: 403 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", VIEW_EVENTS_PROMPT],
    ["user", "{{query}}"]
  ]);

  const CreatePrompt  = ChatPromptTemplate.fromMessages([
    ["system", CREATE_EVENT_PROMPT],
    ["user", "{{query}}"]
  ]);
  const CuserQuery = "show all my schedule of Monday 14 Feb";
  const CcurrentDate = new Date();
  const CcurrentYear = CcurrentDate.getFullYear();
  const CuserTimezone = "Asia/Kolkata"; 
  const CdayName = "Monday"; 
  const CreateChain = CreatePrompt.pipe(model);
  const CreateResponse = await CreateChain.invoke({ query: "Create a meeting for 5 pm on Saturday  with Drashti " ,
    date: CcurrentDate.toISOString(),
    dayName: CdayName,
    u_timezone: CuserTimezone
  });
  const CreateJsonResponse = extractJson(CreateResponse.content);
  let createResponse  = CreateJsonResponse ;
  const parsed  = JSON.parse(createResponse);
  const chain = prompt.pipe(model);

  try {
    const userQuery = "show all my schedule of Monday 14 Feb";
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const userTimezone = "Asia/Kolkata"; 
    const dayName = "Monday"; 
    const queryDate = new Date(`${userQuery} ${currentYear}`);
    const timeMin = queryDate.toISOString().split('T')[0] + 'T00:00:00+05:30';
    const timeMax = queryDate.toISOString().split('T')[0] + 'T23:59:59+05:30';

    const response = await chain.invoke({
      query: userQuery,
      date: currentDate.toISOString(),
      dayName: dayName,
      u_timezone: userTimezone,
      time_min: timeMin,
      time_max: timeMax
    });

    const jsonResponse = extractJson(response.content);
    if (!jsonResponse) {
      throw new Error("Invalid JSON response from the model");
    }

    const actionData = JSON?.parse(jsonResponse);

    const eventsResponse = await getEvents(calendar, { timeMin: timeMin, timeMax: timeMax });
    const beautify = eventsResponse?.events?.map((val,i)=>{
      return {summary:val?.summary ,desc:val?.description ,time:{start:val?.start?.dateTime,end:val?.end?.dateTime}}
    })
    const htmlPrompt = ChatPromptTemplate.fromMessages([
        ["system", HTML_BEAUTIFY_PROMPT],
        ["user", "{{events}}"]
      ]);
  
      const htmlChain = htmlPrompt.pipe(model);
      const htmlResponse = await htmlChain.invoke({ events: beautify });
   
  
    return json({ message: "success", data: actionData ,  res :  parsed ,beautify  : beautify });
  } catch (err) {
    console.error("Error processing command:", err.message);
    return json({ error: "Failed to process command", details: err.message }, { status: 500 });
  }
}


async function getEvents(calendar, timeRange) {
  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeRange.timeMin,
      timeMax: timeRange.timeMax,
      timeZone: "Asia/Kolkata",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return { events: response.data.items || [] };
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return { events: [], error: error.message };
  }
}

