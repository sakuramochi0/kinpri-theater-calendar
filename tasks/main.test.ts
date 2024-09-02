import { test } from '@playwright/test';

import { getCinemaSunshineDailySchedules } from './cinemaSunshine';
import { getTjoySchedules } from './tjoy';
import { getUnitedCinemasSchedules } from './unitedCinemas';
import { generateICal, saveJSON } from './utils';

import type { Schedule, Theater } from './types';

test('ティ・ジョイ系列', async ({ page, browser }) => {
  await page.goto('https://tjoy.jp/')
  const theaters: Theater[] = (await page.locator('.theater-list-info a').evaluateAll(
    links => links.map((a: HTMLLinkElement) => ({ name: a.innerHTML.replace(/<.+/g, '').trim(), url: a.href }))
  ))

  for (const { name, url } of theaters) {
    const newPage = await browser.newPage()
    await getTjoySchedules(newPage, url, name)
  }
})

test('ユナイテッド・シネマ系列', async ({ page, browser }) => {
  await page.goto('https://www.unitedcinemas.jp/index.html', { waitUntil: 'domcontentloaded' })
  const theaters: Theater[] = (await page.locator('#theaterList a').evaluateAll(
    links => links.map((a: HTMLLinkElement) => ({
      name: `ユナイテッド・シネマ${a.querySelector('img').getAttribute('alt')}`,
      url: a.href,
    }))
  ))

  for (const { name, url } of theaters) {  // TODO: debug
    const newPage = await browser.newPage()
    await getUnitedCinemasSchedules(newPage, url, name)
  }
})

test('グランドシネマサンシャイン池袋', async ({ page }) => {
  const theaterName = 'グランドシネマサンシャイン池袋'
  let url = 'https://www.cinemasunshine.co.jp/theater/gdcs/'
  await page.goto(url)

  const schedules: Schedule[] = []
  const dayCount = await page.locator('.schedule-swiper__item').count()
  for (let i = 0; i < dayCount; i++) {
    await page.locator('.schedule-swiper__item').nth(i).click()
    schedules.push(...await getCinemaSunshineDailySchedules(page))
  }

  console.log(schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, url, schedules)
});
