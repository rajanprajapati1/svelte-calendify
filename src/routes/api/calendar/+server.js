import { google } from 'googleapis';
import { json } from '@sveltejs/kit';

export async function GET(event) {
    const session = await event.locals.getSession();
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
     

        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        });
     

        const events = res.data.items.map(event => {
            const startDate = new Date(event.start.dateTime || event.start.date);
            const endDate = new Date(event.end?.dateTime || event.end?.date);
        
            return {
                id: event.id,
                title: event.summary,
                start: startDate.toISOString().split('T')[0], 
                end: endDate.toISOString().split('T')[0],
                allDay: !event.start.dateTime,  // Determine if it's an all-day event
            };
        });
        
        return json({ list:events});
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

export async function POST(event){
    const session = await event.locals.getSession();
    const body = await event.request.json();
    console.log(body)
    if (!session || !session.user ) {
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
            const eventDetails = {
                summary: body.title,
                description: 'This is a test event created via Google Calendar API.',
                start: body.allDay
                    ? { date: body.start, timeZone: 'Asia/Kolkata' } 
                    : { dateTime: new Date(body.start).toISOString(), timeZone: 'Asia/Kolkata' },
                end: body.allDay
                    ? { date: body.end, timeZone: 'Asia/Kolkata' } 
                    : { dateTime: new Date(body.end).toISOString(), timeZone: 'Asia/Kolkata' }, 
            };
    
    
            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource: eventDetails,
            });

        return json({ message: 'Event added successfully', eventDetails });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
      
}