import { test } from '@playwright/test';

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
  await page.goto('https://www.unitedcinemas.jp/index.html', {waitUntil: 'domcontentloaded'})
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
  let url = 'https://www.cinemasunshine.co.jp/theater/gdcs/';
  await page.goto(url);

  // wait for rendering of schedule data
  await page.waitForSelector('#tab1_content .content-item')

  const dialogCloseButton = page.locator('#check-close-btn')
  if (await dialogCloseButton.count() > 0) {
    dialogCloseButton.click()
  }

  const schedules: Schedule[] =
    await page.locator('#tab1_content .content-item')
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
      )

  console.log(schedules)
  saveJSON(theaterName, schedules)
  generateICal(theaterName, url, schedules)
});
