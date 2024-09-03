import { test } from '@playwright/test';

import { getUnitedCinemasSchedules } from './unitedCinemas';
import { generateICal, saveJSON } from './utils';

import type { Theater } from './types';

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
    const { schedules, movieLink } = await getUnitedCinemasSchedules(newPage, url)
    if (schedules === null || movieLink === null) {
      continue
    }

    console.log(schedules)
    saveJSON(name, schedules)
    generateICal(name, movieLink, schedules)

  }
})
