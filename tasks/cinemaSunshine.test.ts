import { test } from '@playwright/test';

import { getCinemaSunshineDailySchedules } from './cinemaSunshine';
import { generateICal, saveJSON } from './utils';

import type { Schedule } from './types';

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
