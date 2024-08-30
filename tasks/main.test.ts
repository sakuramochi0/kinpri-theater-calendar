import { test } from '@playwright/test';
import ical from 'ical-generator';

import { Schedule } from './types';
import { writeFileSync } from 'node:fs';


test('新宿バルト9', async ({ page }) => {
  const theaterName = '新宿バルト9'
  const url = 'https://tjoy.jp/shinjuku_wald9/cinema_schedule/C3864'
  await page.goto(url)
  const scheduleBox = await page.locator('.schedule-box')
  const date = await page.locator('.calendar-item.calendar-active').evaluate(e => e.dataset.date)

  const schedules = await scheduleBox.evaluateAll(schedules => schedules.map(schedule => {
    const screenName = schedule.querySelector('.theater-name').textContent.trim()
    const timeString = schedule.querySelector('.schedule-time').textContent.trim()
    const [[_, startTime, endTime]] = timeString.matchAll(/(\d+:\d+)\D+(\d+:\d+)/g)
    return { screenName, startTime, endTime }
  }))
  const data: Schedule[] = schedules.map(schedule => {
    // FIXME: handle after 24:00. use dayjs etc.
    if (schedule.endTime.includes('24:')) {
      schedule.endTime = '23:59'
    }

    schedule.startTime = new Date(`${date} ${schedule.startTime} GMT+0900`)
    schedule.endTime = new Date(`${date} ${schedule.endTime}  GMT+0900`)

    return schedule
  });
  console.log(data)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, schedules)
});

test('ユナイテッド・シネマ幕張', async ({ page }) => {
  const theaterName = 'ユナイテッド・シネマ幕張'
  const url = 'https://www.unitedcinemas.jp/makuhari/film.php?movie=11512&from=daily'
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const dailySchedules = await page.locator('[id="dailySchedule"]')
  const schedules: Schedule[] = (await dailySchedules.evaluateAll(dailySchedules => dailySchedules.map(
    dailySchedule => {
      const dateString = dailySchedule.querySelector('#topHead a').textContent
      const screens = [...dailySchedule.querySelectorAll('.tl > li')]
      return screens.map(screen => {
        const screenName = screen.querySelector('.screenNumber img').getAttribute('alt')
        let shows = [...screen.querySelectorAll('ol ol')];
        return shows.map(e => {
          const startTimeString = e.querySelector('.startTime').textContent
          const endTimeString = e.querySelector('.endTime').textContent.replace('～', '')
          const startTime = new Date(`${dateString} ${startTimeString} GMT+0900`)
          const endTime = new Date(`${dateString} ${endTimeString} GMT+0900`)
          return { screenName, startTime, endTime }
        })
      })
    }))).flat(2)

  console.log(schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, schedules)
});

function generateICal(theaterName: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const calendar = ical({ name: calendarName });

  schedules.forEach(schedule => {
    calendar.createEvent({
      start: schedule.startTime,
      end: schedule.endTime,
      summary: `${theaterName} ${schedule.screenName}`,
      description: 'プリズムの煌めきをあなたに✨',
      location: `${theaterName} ${schedule.screenName}`,
      url: 'https://kinpri.com'
    })
  })

  const filename = `data/${calendarName}.ics`
  writeFileSync(filename, calendar.toString())
}

function saveJSON(theaterName: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const filename = `data/${calendarName}.json`
  const content = JSON.stringify(schedules, null, 2)
  writeFileSync(filename, content)
}
