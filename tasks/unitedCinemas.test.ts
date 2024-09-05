import { Page, test } from '@playwright/test';

import { generateICal, saveJSON } from './utils';

import { Schedule, Theater } from './types';

test('ユナイテッド・シネマ系列', async ({ page, browser }) => {
  await page.goto('https://www.unitedcinemas.jp/index.html', { waitUntil: 'domcontentloaded' })
  const theaters: Theater[] = (await page.locator('#theaterList a').evaluateAll(
    links => links.map(a => ({
      name: `ユナイテッド・シネマ${a.querySelector('img')!.getAttribute('alt')}`,
      url: a.href,
    }))
  ))

  for (const { name, url } of theaters) {  // TODO: debug
    const newPage = await browser.newPage()
    const { schedules, movieLink } = await getUnitedCinemasSchedules(newPage, url)
    if (schedules === null || movieLink === null) {
      continue
    }

    console.log(schedules)
    saveJSON(name, schedules)
    generateICal(name, movieLink, schedules)

  }
})

export async function getUnitedCinemasSchedules(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const notificationCloseButton = page.getByRole('button', { name: '閉じる' })
  if (await notificationCloseButton.count() > 0) {
    await notificationCloseButton.click()
  }

  await page.getByRole('link', { name: '上映作品' }).click()
  const link = page.getByRole('link', { name: /KING OF PRISM/ }).nth(1)
  try {
    await link.waitFor({ timeout: 1000 })
  } catch {
    console.log('movies not found')
    return { schedules: null, movieLink: null }
  }
  const movieLink: string = await link.evaluate<any, HTMLLinkElement>(a => a.href)
  await page.goto(movieLink)

  const dailySchedules = page.locator('[id="dailySchedule"]')
  const schedules: Schedule[] = (await dailySchedules.evaluateAll(
    dailySchedules => dailySchedules.map(
      dailySchedule => {
        const dateString = dailySchedule.querySelector('#topHead a')!.textContent
        const screens = [...dailySchedule.querySelectorAll('.tl > li')]
        return screens.map(screen => {
          const screenName = screen.querySelector('.screenNumber img')?.getAttribute('alt') ?? ''
          let shows = [...screen.querySelectorAll('ol ol')];
          return shows.map(show => {
            const year = new Date().getFullYear()
            const startTimeString = show.querySelector('.startTime')?.textContent
            const endTimeString = show.querySelector('.endTime')?.textContent?.replace('～', '') ?? ''
            const startTime = new Date(`${year} ${dateString} ${startTimeString} GMT+0900`)
            const endTime = new Date(`${year} ${dateString} ${endTimeString} GMT+0900`)
            return { screenName, startTime, endTime }
          })
        })
      }))).flat(2)

  return { schedules, movieLink }
}
