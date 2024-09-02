import { Page } from '@playwright/test';
import { Schedule } from './types';
import { generateICal, isValidDate, saveJSON } from './utils';

export async function getTjoySchedules(page: Page, url: string, theaterName: string) {
  await page.goto(url)

  const notificationCloseButton = page.getByRole('button', { name: '閉じる' })
  if (await notificationCloseButton.count() > 0) {
    await notificationCloseButton.click()
  }

  await page.getByRole('link', { name: '作品情報' }).click()
  const movieButton = page.getByRole('link', { name: /KING OF PRISM/ })
  if (await movieButton.count() === 0) {
    return
  }
  await movieButton.click()
  await page.getByRole('link', { name: '上映スケジュール' }).nth(1).click()

  const schedules = []
  const days = await page.locator('.calendar-item').evaluateAll(days => days.map(day => day.dataset.date))
  for (const day of days) {
    const daySelector = `[data-date="${day}"]`
    await page.locator(daySelector).click()
    try {
      // when clicking day button, daily data is fetched from server as HTML snippet containing `.film-item`
      await page.waitForSelector('.film-item', { timeout: 3000 })
    } catch (e) {
      break
    }
    schedules.push(...await getTjoyDailySchedules(page))
  }

  console.log(theaterName, schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, url, schedules)
}

async function getTjoyDailySchedules(page: Page) {
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

  return schedules
}
