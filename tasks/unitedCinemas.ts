import { Page } from '@playwright/test';
import { Schedule } from './types';
import { generateICal, isValidDate, saveJSON } from './utils';

export async function getUnitedCinemasSchedules(page: Page, url: string, theaterName: string) {
  await page.goto(url, {waitUntil: 'domcontentloaded'})

  const notificationCloseButton = page.getByRole('button', { name: '閉じる' })
  if (await notificationCloseButton.count() > 0) {
    await notificationCloseButton.click()
  }

  await page.getByRole('link', { name: '上映作品' }).click()
  const link = page.getByRole('link', { name: /KING OF PRISM/ }).nth(1)
  try {
    await link.waitFor({timeout: 1000})
  } catch {
    console.log('not found')
    return
  }
  const movieLink = await link.evaluate(a => a.href)
  await page.goto(movieLink)

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
  generateICal(theaterName, movieLink, schedules)
}
