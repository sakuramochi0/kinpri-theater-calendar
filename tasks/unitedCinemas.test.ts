import { Page, test } from '@playwright/test';

import { generateICal, rootLogger, saveJSON } from './utils';

import { Schedule, Theater } from './types';

test('ユナイテッド・シネマ系列', async ({ page, browser }) => {
  const seriesLogger = rootLogger.child({ 'series': 'ユナイテッド・シネマ' })

  await page.goto('https://www.unitedcinemas.jp/index.html', { waitUntil: 'domcontentloaded' })
  const theaters: Theater[] = (await page.locator('#theaterList a').evaluateAll(
    links => links.map(a => ({
      name: `ユナイテッド・シネマ${a.querySelector('img')!.getAttribute('alt')}`,
      url: a.href,
    }))
  ))
  await page.close()

  for (const { name, url } of theaters) {
    const theaterLogger = seriesLogger.child({ theater: name })

    const newPage = await browser.newPage()
    const { schedules, movieLink } = await getUnitedCinemasSchedules(newPage, url)
    if (schedules === null || movieLink === null) {
      theaterLogger.info('no movie found')
      continue
    }

    theaterLogger.info(`record ${schedules.length} shows`)
    saveJSON(name, schedules)
    generateICal(name, movieLink, schedules)

  }
})

export async function getUnitedCinemasSchedules(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const notificationCloseButton1 = page.getByRole('button', { name: '閉じる' })
  if (await notificationCloseButton1.count() > 0) {
    await notificationCloseButton1.click()
  }

  try {
    const notificationCloseButton2 = await page.waitForSelector('.closeBtn', { timeout: 1000 })
    await notificationCloseButton2.click()
  } catch {}

  await page.getByRole('link', { name: '上映作品' }).click()
  const link = page.getByRole('link', { name: /KING OF PRISM/ }).nth(1)
  try {
    await link.waitFor({ timeout: 1000 })
  } catch {
    return { schedules: null, movieLink: null }
  }
  const movieLink: string = await link.evaluate<any, HTMLLinkElement>(a => a.href)
  await page.goto(movieLink)

  const dailySchedules = page.locator('[id="dailySchedule"]')
  const schedules: Schedule[] = (await dailySchedules.evaluateAll(
    dailySchedules => dailySchedules.map(
      dailySchedule => {
        const dateString = dailySchedule.querySelector('#topHead a')!.textContent
        const movies = [...dailySchedule.querySelectorAll('#dailyList > li')]
        return movies.map(movie => {
          const is4DX = !!movie.querySelector('a[href*="4dx"]')
          const isScreenX = !!movie.querySelector('a[href*="screenx"]')
          const type = is4DX ? '[4DX] ' : isScreenX ? '[ScreenX] ' : ''
          const title = type + movie.querySelector('h4')?.textContent?.trim() ?? ''
          const screens = [...movie.querySelectorAll('.tl > li')]
          return screens.map(screen => {
            const screenName = screen.querySelector('.screenNumber img')?.getAttribute('alt') ?? ''
            let shows = [...screen.querySelectorAll('ol > li > div')];
            return shows.map(show => {
              const year = new Date().getFullYear()
              const startTimeString = show.querySelector('.startTime')?.textContent
              const endTimeString = show.querySelector('.endTime')?.textContent?.replace('～', '') ?? ''
              const startTime = new Date(`${year} ${dateString} ${startTimeString} GMT+0900`)
              const endTime = new Date(`${year} ${dateString} ${endTimeString} GMT+0900`)

              const statusText = show.querySelector('.scheduleIcon')
                  ?.getAttribute('alt')
                  ?.replace('[', '').replace(']', '')
                ?? ''
              const status = statusText === '□' ? '販売対象外' : statusText
              return { title, screenName, startTime, endTime, status }
            })
          })
        })
      }))).flat(3)

  return { schedules, movieLink }
}
