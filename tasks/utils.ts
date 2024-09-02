import { Schedule } from './types';
import ical from 'ical-generator';
import { writeFileSync } from 'node:fs';

export function generateICal(theaterName: string, url: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const calendar = ical({ name: calendarName });

  schedules.forEach(schedule => {
    console.log(schedule)
    calendar.createEvent({
      start: schedule.startTime,
      end: schedule.endTime,
      summary: `${theaterName} ${schedule.screenName}`,
      description: `プリズムの煌めきをあなたに✨\n上映スケジュール: ${url}`,
      location: `${theaterName} ${schedule.screenName}`,
      url,
    })
  })

  const filename = `data/${calendarName}.ics`
  writeFileSync(filename, calendar.toString())
}

export function saveJSON(theaterName: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const filename = `data/${calendarName}.json`
  const content = JSON.stringify(schedules, null, 2)
  writeFileSync(filename, content)
}

export function isValidDate(d: Date) {
  // @ts-ignore
  return d instanceof Date && !isNaN(d)
}
