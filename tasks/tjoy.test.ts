import { test } from '@playwright/test';

import { getTjoySchedules } from './tjoy';
import { generateICal, saveJSON } from './utils';

import type { Theater } from './types';

test('ティ・ジョイ系列', async ({ page, browser }) => {
  await page.goto('https://tjoy.jp/')
  const theaters: Theater[] = await page.locator('.theater-list-info a')
    .evaluateAll(
      links => links.map(
        (a: HTMLLinkElement) => ({ name: a.innerHTML.replace(/<.+/g, '').trim(), url: a.href })
      )
    )

  for (const { name, url } of theaters) {
    const newPage = await browser.newPage()
    const schedules = await getTjoySchedules(newPage, url, name)
    if (schedules === null) {
      continue
    }

    console.log(name, schedules)
    saveJSON(name, schedules)
    generateICal(name, url, schedules)
  }
})
