export const VIEW_EVENTS_PROMPT = `
Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on the event description: '{query}',
output a JSON object with the following parameters:
- Today's datetime on UTC time {date}, it's {dayName} and the user's timezone is {u_timezone}.
- Take into account the user's timezone and today's date.
- If the user is searching for events with a specific title, person, or location, include it in the search_query parameter.

Parameters:
1. time_min
2. time_max
3. user_timezone
4. max_results
5. search_query

Example JSON structure:
{{
    "time_min": "2023-05-04T00:00:00+05:30",
    "time_max": "2023-05-04T23:59:59+05:30",
    "user_timezone": "Asia/Kolkata",
    "max_results": 10,
    "search_query": ""
}}
`;

