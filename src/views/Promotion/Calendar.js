import FullCalendar from '@fullcalendar/react';
import { useRef } from 'react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const FEATURED_CALENDAR_ID =
  'hvl6vae405en407paoh9gaqsso@group.calendar.google.com';
const GEM_CALENDAR_ID = '66mmthm83fkfj7tf7g20q1s5fs@group.calendar.google.com';

const Calendar = ({ type }) => {
  const calendarRef = useRef(null);

  return (
    <FullCalendar
      innerRef={calendarRef}
      plugins={[googleCalendarPlugin, dayGridPlugin, timeGridPlugin]}
      googleCalendarApiKey="AIzaSyATT-r26wjQvLg9Up6RVifUv66UpPb91eI"
      events={{
        googleCalendarId:
          type === 'featured' ? FEATURED_CALENDAR_ID : GEM_CALENDAR_ID,
      }}
    />
  );
};

export default Calendar;
