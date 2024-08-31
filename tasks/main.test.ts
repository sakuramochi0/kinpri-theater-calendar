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

  const rawSchedules = await scheduleBox.evaluateAll(schedules => schedules.map(schedule => {
    const screenName = schedule.querySelector('.theater-name').textContent.trim()
    const timeString = schedule.querySelector('.schedule-time').textContent.trim()
    const [[_, startTime, endTime]] = timeString.matchAll(/(\d+:\d+)\D+(\d+:\d+)/g)
    return { screenName, startTime, endTime }
  }))
  const schedules: Schedule[] = rawSchedules.map(schedule => {
    // FIXME: handle after 24:00. use dayjs etc.
    const startHour = parseInt(schedule.startTime.split(':')[0])
    const endHour = parseInt(schedule.endTime.split(':')[0])
    if (startHour >= 24) {
      schedule.startTime = '23:59'
    }
    if (endHour >= 24) {
      schedule.endTime = '23:59'
    }

    schedule.startTime = new Date(`${date} ${schedule.startTime} GMT+0900`)
    schedule.endTime = new Date(`${date} ${schedule.endTime}  GMT+0900`)

    return schedule
  })
    .filter(e => isValidDate(e.startTime))

  console.log(schedules)
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
          const year = new Date().getFullYear()
          const startTimeString = e.querySelector('.startTime').textContent
          const endTimeString = e.querySelector('.endTime').textContent.replace('～', '')
          const startTime = new Date(`${year} ${dateString} ${startTimeString} GMT+0900`)
          const endTime = new Date(`${year} ${dateString} ${endTimeString} GMT+0900`)
          return { screenName, startTime, endTime }
        })
      })
    }))).flat(2)

  console.log(schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, schedules)
});

test('グランドシネマサンシャイン池袋', async ({ page }) => {
  const theaterName = 'グランドシネマサンシャイン池袋'
  await page.goto('https://www.cinemasunshine.co.jp/theater/gdcs/');
  await page.locator('#check-close-btn').click()

  const schedules: Schedule[] =
    await page.locator('#tab1_content .content-item')
      .evaluateAll(movies => movies
        .filter(movie => movie.querySelector('.title').textContent.includes('KING OF PRISM'))
        .map(movie => [...movie.querySelectorAll('.schedule-item')]
          .map(e => ({
            time: e.querySelector('.time').textContent.trim(),
            purchase: e.querySelector('.purchase').textContent.trim(),
            screenName: e.querySelector('.info').textContent.trim(),
          }))).flat()
        .map(rawSchedule => {
          /**
           *   {
           *     time: '21:30〜\n            22:44',
           *     title: 'プリズムスタァ応援上映『KING OF PRISM -Dramatic PRISM.1-』BESTIA enhanced',
           *     purchase: '◯ 購入',
           *     info: 'シアター６ BESTIA'
           *   }
           */
          const screenName = rawSchedule.screenName

          const year = new Date().getFullYear()
          const day = document.querySelector('#schedule .active .day').textContent.trim()
          const [_, startTimeString, endTimeString] = rawSchedule.time.match(/(\d+:\d+)\D+(\d+:\d+)/)
          const startTime = new Date(`${year}/${day} ${startTimeString} GMT+0900`)
          const endTime = new Date(`${year}/${day} ${endTimeString} GMT+0900`)
          return { screenName, startTime, endTime }
        })
      )

  console.log(schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, schedules)
});

function generateICal(theaterName: string, schedules: Schedule[]) {
  let calendarName = `${theaterName} 『KING OF PRISM -Dramatic PRISM.1-』上映時間`;
  const calendar = ical({ name: calendarName });

  schedules.forEach(schedule => {
    console.log(schedule)
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

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
