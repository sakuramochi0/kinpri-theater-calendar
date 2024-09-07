import { expect, Page, test } from '@playwright/test';

import { generateICal, rootLogger, saveJSON } from './utils';

import { Schedule, Theater } from './types';

test('イオンシネマ系列', async ({ page }) => {
  const seriesLogger = rootLogger.child({'series': 'イオンシネマ'})

  await page.goto('https://www.aeoncinema.com/')
  await page.getByRole('link', { name: /作品案内/ }).first().click()

  await page.locator('.cinemaBlock')
    .filter({ hasText: /KING OF PRISM/ })
    .locator('.cbTitle')
    .click()

  const theaterList = page.locator('.table_sakuhinpage_screeningStatus').first()
  await expect(theaterList).toBeVisible()

  const theaters: Theater[] = await theaterList.locator('a').evaluateAll(links => links.map(theaterLink => ({
    name: theaterLink.textContent,
    url: theaterLink.href,
  })))
  seriesLogger.info(`found ${theaters.length} theaters`)

  for (const theater of theaters) {
    const theaterLogger = seriesLogger.child({theater: theater.name})
    const schedules = await getTheaterSchedules(page, theater)
    if (schedules == null) {
      theaterLogger.warn('new design website is not supported yet')
      continue
    }

    theaterLogger.info(`record ${schedules.length} shows`)
    saveJSON(theater.name, schedules)
    generateICal(theater.name, theater.url, schedules)
  }
})

async function getTheaterSchedules(page: Page, theater: Theater) {
  await page.goto(theater.url)

  const isNewWebsiteDesign = await checkNewWebsiteDesign(page)
  if (isNewWebsiteDesign) {
    // TODO: implement
    return null
  }

  const schedules: Schedule[] = []

  const year = new Date().getFullYear()
  const [monthString, dayString] = (await page.locator('.today').first().textContent())!.match(/\d+/g)
  const dateString = `${year}/${monthString}/${dayString}`

  await expect(page.locator('.movielist').last()).toBeVisible()
  const movies = await page.locator('.movielist').filter({ hasText: /KING OF PRISM/ }).all()
  for (const movie of movies) {
    const title = (await movie.locator('.main a').first().textContent() ?? '').trim()
    const shows = (await movie.locator('.timetbl > div').all()).slice(1, -1)
    for (const show of shows) {
      const timeString = await show.locator('.time').first().textContent()
      const [startHour, startMinute, endHour, endMinute] = timeString.match(/\d+/g)
      const startTime = new Date(`${dateString} ${startHour}:${startMinute}`)
      const endTime = new Date(`${dateString} ${endHour}:${endMinute}`)
      const screenName = (await show.locator('.screen').first().textContent())?.trim() ?? ''
      const status = (await show.locator('.txt_btn').first().textContent())?.trim() ?? ''
      schedules.push({ title, startTime, endTime, screenName, status })
    }
  }

  return schedules
}


async function checkNewWebsiteDesign(page: Page) {
  try {
    await page.locator('#smart-portal-schedules').waitFor({ state: 'visible', timeout: 3000 })
    return true
  } catch {
    return false
  }
}
