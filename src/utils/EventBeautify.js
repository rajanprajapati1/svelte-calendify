function getEventColor(event) {
  const googleCalendarColors = [
    '#4285F4', // Blue
    '#DB4437', // Red
    '#0F9D58', // Green
    '#F4B400', // Yellow
    '#AB47BC', // Purple
    '#FF7043', // Orange
    '#66BB6A', // Light Green
    '#29B6F6', // Light Blue
  ];

  const randomIndex = Math.floor(Math.random() * googleCalendarColors.length);
  return googleCalendarColors[randomIndex];
}

  function renderEventContent(eventInfo) {
    return {
      html: `
        <div style="background-color: ${eventInfo.event.backgroundColor}; color: ${eventInfo.event.textColor}; padding: 2px 5px; width:100% ; border-radius: 3px;">
          <b>${eventInfo.timeText}</b>
          <i>${eventInfo.event.title}</i>
        </div>
      `
    };
  }


  export {renderEventContent ,getEventColor}