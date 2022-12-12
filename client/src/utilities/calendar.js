import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'

// const useDate = () => {
//   const [date, setDate] = useState(new Date());
//   const year = getYear(date);
//   // Month in string format; e.g. 'November'
//   const month = format(date, "LLLL");
//   const daysInMonth = getDaysInMonth(date);
//   // First day of the month; e.g. 'Tue'
//   const firstDay = format(startOfMonth(date), "E");

//   const getNextMonth = () => {
//     setDate(prevDate => new Date(getYear(prevDate), getMonth(prevDate) + 1));
//   };

//   const getPreviousMonth = () => {
//     setDate(prevDate => new Date(getYear(prevDate), getMonth(prevDate) - 1));
//   };

//   return {
//     year,
//     month,
//     daysInMonth,
//     firstDay,
//     getNextMonth,
//     getPreviousMonth,
//   };
// };

export const getMatchMonth = (monthToMatch, events) => {
  if (!events.length) return [];

  return events.map(event => {
    let events = new Array(event)
    events.push(...event.dates)
    return events
  }).flat().filter(event => {
    const isoDate = parseISO(event.initialDate || event.startAt);
    const monthInString = format(isoDate, 'LLLL'); // December
    return monthToMatch === monthInString
  })
}

export const getEventsByDayNumber = (currentDay, allEvents) => {
  if (!allEvents.length) return [];

  return allEvents.filter(event => {
    const isoDate = parseISO(event.initialDate || event.startAt);
    const day = format(isoDate, 'd'); // '2'
    return currentDay === Number(day)
  })
}

export const formatToLocalTime = date => {
  const isoDate = parseISO(date);
  return format(isoDate, 'p')
}

export const createDateInUTC = (htmlDate = '', htmlTime = '') => {
  const [year, month, day] = htmlDate.split('-');
  const [hour, minute] = htmlTime.split(':');

  // Month is 0 based so we need to subtract 1
  return new Date(Date.UTC(year, month - 1, day, hour, minute))
}

export const generateRecurringDatesArray = ({ initialDate, startTime, endDate, endTime}, event) => {
  // Generate UTC time from HTML input (date and time).
  const startUTC = createDateInUTC(initialDate, startTime);
  const endUTC = createDateInUTC(endDate, endTime);
  // Generate a range of dates in between initialDate & endDate (date-fns does not generate the time sadly)
  const result = eachDayOfInterval({
    start: startUTC,
    end: endUTC,
  })

  // Create recurring dates array with events information
  const dates = result.map(date => {
    const [month, day, year] = format(date, 'P').split('/')
    const htmlDateFormat = `${year}-${month}-${day}`;
    
    // Recreate date with time added
    const newStartDate = createDateInUTC(htmlDateFormat, startTime);
    const newEndDate = createDateInUTC(htmlDateFormat, endTime);

    return {
      title: event.title,
      description: event.description,
      startAt: newStartDate,
      endAt: newEndDate,
      location:event.location,
    }
  })

  return dates
}