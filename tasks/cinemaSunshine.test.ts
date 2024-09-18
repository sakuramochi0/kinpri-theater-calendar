import { Page, test } from '@playwright/test';

import { generateICal, rootLogger, saveJSON } from './utils';

import type { Schedule, Theater } from './types';

test('グランドシネマサンシャイン池袋', async ({ page }) => {
  const seriesLogger = rootLogger.child({'series': 'グランドシネマサンシャイン池袋'})

  const theater: Theater = {
    name: 'グランドシネマサンシャイン池袋',
    url: 'https://www.cinemasunshine.co.jp/theater/gdcs/',
  }
  await page.goto(theater.url)
  const theaterLogger = seriesLogger.child({theater: theater.name})

  const schedules: Schedule[] = []
  const dayCount = await page.locator('.schedule-swiper__item').count()
  for (let i = 0; i < dayCount; i++) {
    await page.locator('.schedule-swiper__item').nth(i).click()
    // TODO: better wait method for loading
    await page.waitForTimeout(500)
    schedules.push(...await getCinemaSunshineDailySchedules(page))
  }

  theaterLogger.info(`record ${schedules.length} shows`)
  saveJSON(theater.name, schedules)
  generateICal(theater.name, theater.url, schedules)
});

export async function getCinemaSunshineDailySchedules(page: Page) {
  // wait for rendering of schedule data
  await page.waitForSelector('#tab1_content .content-item')

  const dialogCloseButton = page.locator('#check-close-btn')
  if (await dialogCloseButton.count() > 0) {
    await dialogCloseButton.click()
  }

  return await page
    .locator('#tab1_content .content-item')
    .evaluateAll(movies => movies
      .filter(movie => movie.querySelector('.title')!.textContent!.includes('KING OF PRISM'))
      .map(movie => {
        const title = movie.querySelector('.title')!.textContent!.trim()
        return [...movie.querySelectorAll('.schedule-item')]
          .map(e => ({
            title,
            time: e.querySelector('.time')!.textContent!.trim(),
            status: e.querySelector('.purchase')!.textContent!.trim(),
            screenName: e.querySelector('.info')!.textContent!.trim(),
          }));
      }).flat()
      .map(({ title, screenName, time, status }) => {
        /**
         *   {
         *     time: '21:30〜\n            22:44',
         *     title: 'プリズムスタァ応援上映『KING OF PRISM -Dramatic PRISM.1-』BESTIA enhanced',
         *     purchase: '◯ 購入',
         *     info: 'シアター６ BESTIA'
         *   }
         */

        const year = new Date().getFullYear()
        const day = document.querySelector('#schedule .active .day')!.textContent!.trim()
        const [_, startTimeString, endTimeString] = time.match(/(\d+:\d+)\D+(\d+:\d+)/)!
        const startTime = new Date(`${year}/${day} ${startTimeString} GMT+0900`)
        const endTime = new Date(`${year}/${day} ${endTimeString} GMT+0900`)
        return { title, screenName, startTime, endTime, status }
      })
    );
}
