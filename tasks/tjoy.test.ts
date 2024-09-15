import { Page, test } from '@playwright/test';

import { generateICal, isValidDate, rootLogger, saveJSON } from './utils';

import { Schedule, Theater } from './types';

test('ティ・ジョイ系列', async ({ page, browser }) => {
  const seriesLogger = rootLogger.child({ 'series': 'ティ・ジョイ' })

  await page.goto('https://tjoy.jp/')
  const theaters: Theater[] = await page.locator('.theater-list-info a')
    .evaluateAll(
      links => links.map(
        (a: HTMLLinkElement) => ({ name: a.innerHTML.replace(/<.+/g, '').trim(), url: a.href })
      )
    )

  for (const { name, url } of theaters) {
    const theaterLogger = seriesLogger.child({ theater: name })

    const newPage = await browser.newPage()
    const { schedules, scheduleURL } = await getTjoySchedules(newPage, url)
    if (schedules === null) {
      continue
    }

    theaterLogger.info(`record ${schedules.length} shows`)
    saveJSON(name, schedules)
    generateICal(name, scheduleURL, schedules)
  }
})

export async function getTjoySchedules(page: Page, url: string) {
  await page.goto(url)

  const notificationCloseButton = page.getByRole('button', { name: '閉じる' })
  if (await notificationCloseButton.count() > 0) {
    await notificationCloseButton.click()
  }

  await page.getByRole('link', { name: '作品情報' }).click()
  const movieButton = page.getByRole('link', { name: /KING OF PRISM/ })
  if (await movieButton.count() === 0) {
    return { schedules: null, scheduleURL: null }
  }
  await movieButton.click()
  await page.getByRole('link', { name: '上映スケジュール' }).nth(1).click()

  const scheduleURL = await page.evaluate(() => location.href)

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

  return { schedules, scheduleURL }
}

async function getTjoyDailySchedules(page: Page) {
  const date = await page.locator('.calendar-item.calendar-active').evaluate(e => e.dataset.date)

  const movies = page.locator('.section-container')
  const schedules: Schedule[] = (await movies.evaluateAll(
      (movies, date) => movies.map(
        movie => {
          const title = movie.querySelector('.js-title-film')!.textContent!.trim()
          const shows = [...movie.querySelectorAll('.schedule-box')]
          return shows.map(
            show => {
              const screenName = show.querySelector('.theater-name')!.textContent!.trim()
              const timeString = show.querySelector('.schedule-time')!.textContent!.trim()
              let [[_, startTimeString, endTimeString]] = timeString.matchAll(/(\d+:\d+)\D+(\d+:\d+)/g)

              // FIXME: handle after 24:00. use dayjs etc.
              const startHour = parseInt(startTimeString.split(':')[0])
              const endHour = parseInt(endTimeString.split(':')[0])

              if (startHour >= 24) {
                startTimeString = '23:59'
              }
              if (endHour >= 24) {
                endTimeString = '23:59'
              }
              const startTime = new Date(`${date} ${startTimeString} GMT+0900`)
              const endTime = new Date(`${date} ${endTimeString}  GMT+0900`)

              const statusText = show.querySelector('.schedule-status')!.textContent!.trim()

              let statusSymbol: string
              const icon = show.querySelector('.schedule-status img.icon-top')!
              const src = icon.getAttribute('src')!
              if (src.includes('icon_label3')) {
                statusSymbol = '◎'
              } else if (src.includes('icon_label2')) {
                statusSymbol = '○'
              } else if (src.includes('icon_label4')) {
                statusSymbol = '△'
              } else if (src.includes('icon_label5')) {
                statusSymbol = '☓'
              } else if (src.includes('icon_label1')) {
                statusSymbol = '-'
              } else {
                statusSymbol = ''
              }

              const status = `${statusSymbol}${statusText}`
              return { title, screenName, startTime, endTime, status }
            }
          )
        }
      ),
      date
    )
  )
    .flat(2)
    // FIXME: handle after 24:00. use dayjs etc.
    .filter(e => isValidDate(e.startTime))

  return schedules
}
