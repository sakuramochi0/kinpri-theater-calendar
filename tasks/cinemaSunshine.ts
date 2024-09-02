import { Page } from '@playwright/test';
import type { Schedule } from './types';

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
    );
}
