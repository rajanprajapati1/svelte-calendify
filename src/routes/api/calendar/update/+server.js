import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

export async function PATCH(event) {
    const session = await event.locals.getSession();
    const body = await event.request.json();
console.log(body,"updapate api")
    if (!session || !session.user) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const accessToken = session?.access_token;
    if (!accessToken) {
        return json({ error: 'No access token' }, { status: 403 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {

        const now = new Date(); 
        const eventStart = body.allDay
            ? new Date(body.start + "T00:00:00Z") 
            : new Date(body.start);

        if (eventStart < now) {
            return json({ error: "Cannot schedule an event in the past" }, { status: 400 });
        }

        const eventDetails = {
            summary: body.title,
            description: 'This is a test event updated via Google Calendar API.',
            start: body?.allDay
                ? { date: body.start, timeZone: 'Asia/Kolkata' } 
                : { dateTime: new Date(body.start).toISOString(), timeZone: 'Asia/Kolkata' },
            end: body?.allDay
                ? { date: body.end, timeZone: 'Asia/Kolkata' } 
                : { dateTime: new Date(body.end).toISOString(), timeZone: 'Asia/Kolkata' }, 
        };

        await calendar.events.update({
            calendarId: 'primary',
            eventId: body.id,  
            resource: eventDetails,
        });

        return json({ message: 'Event updated successfully', eventDetails });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
