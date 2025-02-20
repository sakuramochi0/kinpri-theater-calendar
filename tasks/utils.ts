import { Schedule } from './types';
import ical from 'ical-generator';
import { writeFileSync } from 'node:fs';
import pino from 'pino';
import { v5 as uuidv5 } from 'uuid'

const UUID_NAMESPACE = '3fc014d2-2571-41f2-b05d-cf07db4b097e';

export const rootLogger = pino()

export function generateICal(theaterName: string, url: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const calendar = ical({ name: calendarName });

  schedules.forEach(schedule => {
    const id = JSON.stringify(schedule)
    calendar.createEvent({
      id: uuidv5(id, UUID_NAMESPACE),
      start: schedule.startTime,
      end: schedule.endTime,
      summary: `${schedule.status ? `[${schedule.status}] ` : ''} ${schedule.title ?? ''}`,
      description: `プリズムの煌めきをあなたに✨\n映画館の上映スケジュール: ${url}\nカレンダー生成プログラムのウェブサイト: kinpri-theater-calendar - https://kinpri-theater-calendar.skrm.ch/`,
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
