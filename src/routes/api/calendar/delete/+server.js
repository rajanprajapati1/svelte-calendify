import { google } from 'googleapis';
import { json } from '@sveltejs/kit';


export async function DELETE(event) {
    const session = await event.locals.getSession();
    const body = await event.request.json();

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
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: body.id,  
        });

        return json({ message: 'Event deleted successfully' });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

