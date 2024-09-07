import { Locator, Page, test } from '@playwright/test';

import { generateICal, rootLogger, saveJSON } from './utils';

import type { Schedule, Theater } from './types';

test('TOHOシネマズ系列', async ({ page }) => {
  const seriesLogger = rootLogger.child({'series': 'イオンシネマ'})

  const moviesListPageURL = 'https://hlo.tohotheater.jp/net/movie/TNPI3090J01.do'
  await page.goto(moviesListPageURL)
  const movieLink = page.getByRole('link', { name: /ＫＩＮＧ ＯＦ ＰＲＩＳＭ/ })
  if (await movieLink.count() === 0) {
    seriesLogger.info('no movie found')
    return
  }
  await movieLink.click()

  const regionLinks = page.locator('#showing-tabs .tab-nav a')
  for (const regionLink of await regionLinks.all()) {
    await regionLink.click()

    const currentTabId = await page.locator('.tab-nav .is-current a').nth(0).evaluate(e => e.hash)
    const theaterHeaders = page.locator(`${currentTabId} .theater-list-title`)
    if (await theaterHeaders.count() === 0) {
      console.log('theater not found')
      continue
    }

    for (const theaterHeader of await theaterHeaders.all()) {
      const { schedules, theater } = await getTohoCinemasSchedules(theaterHeader, page, currentTabId);

      const theaterLogger = seriesLogger.child({theater: theater.name})
      theaterLogger.info(`record ${schedules.length} shows`)
      saveJSON(theater.name, schedules)
      generateICal(theater.name, theater.url, schedules)
    }
  }
})

async function getTohoCinemasSchedules(theaterHeader: Locator, page: Page, currentTabId: string) {
  const schedules: Schedule[] = []

  await theaterHeader.click()
  const dailyScheduleContainerId = await theaterHeader.evaluate(e => e.dataset.href);
  const theater: Theater = {
    name: await theaterHeader.evaluate(e => e.textContent!.trim()),
    url: await page.evaluate(() => location.href),
  }

  await page.waitForTimeout(1000)

  const days = await page.locator(`${currentTabId} .schedule-tab-item:not(.is-disabled)`).all()
  for (const day of days) {
    await day.click()
    const dailySchedules = await getTohoCinemasDailySchedules(page, dailyScheduleContainerId);

    schedules.push(...dailySchedules)
  }
  return { schedules, theater }
}

async function getTohoCinemasDailySchedules(page: Page, dailyScheduleContainerId: string | undefined) {
  const movies = page.locator(`#${dailyScheduleContainerId} .schedule-body`)
  const dailySchedules: Schedule[] = (await movies.evaluateAll(
    movies => movies.map(
      movie => {
        function getStatusSymbol(statusDOM: HTMLParagraphElement): string {
          const icon = statusDOM.querySelector('i')
          if (!icon) {
            return ''
          }
          if (icon.classList.contains('glyphicon-icon_circle')) {
            return '○'
          } else if (icon.classList.contains('glyphicon-icon_circle-double')) {
            return '◎'
          } else {
            return ''
          }
        }

        const title = movie.querySelector('h6')!.textContent!.trim()
        const match = movie.querySelector('#scheduleDate')!.textContent!.match(/(\d+)月(\d+)/)!
        const year = new Date().getFullYear()
        const date = `${year}/${match[1]}/${match[2]}`

        const screens = [...movie.querySelectorAll('.schedule-body-section-item')]
        return screens.map(screen => {
          const screenName = screen.querySelector('.schedule-screen-title')!.textContent!.trim()
          const shows = [...screen.querySelectorAll('.schedule-item')]
          return shows.map(show => {
            const startString = show.querySelector('.start')!.textContent!.trim()
            const endString = show.querySelector('.end')!.textContent!.trim()
            const startTime = new Date(`${date} ${startString} GMT+0900`)
            const endTime = new Date(`${date} ${endString} GMT+0900`)
            const statusDOM: HTMLParagraphElement = show.querySelector('.status')!
            const statusText = statusDOM!.textContent!.trim()
            const statusSymbol = getStatusSymbol(statusDOM)
            const status = `${statusSymbol}${statusText}`
            return { title, screenName, startTime, endTime, status }
          }).flat()
        }).flat()
      }))).flat()
  return dailySchedules;
}
