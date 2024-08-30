import { test } from '@playwright/test';

test('新宿バルト9', async ({ page }) => {
  const url = 'https://tjoy.jp/shinjuku_wald9/cinema_schedule/C3864'
  await page.goto(url)
  const scheduleBox = await page.locator('.schedule-box')
  const date = await page.locator('.calendar-item.calendar-active').evaluate(e=>e.dataset.date)

  const schedules = await scheduleBox.evaluateAll(schedules => schedules.map(schedule => {
    const screenName = schedule.querySelector('.theater-name').textContent.trim()
    const timeString = schedule.querySelector('.schedule-time').textContent.trim()
    const [[_, startTime, endTime]] = timeString.matchAll(/(\d+:\d+)\D+(\d+:\d+)/g)
    return {screenName, startTime, endTime}
    return {theaterName, startTime, endTime}
  }))
  const data = schedules.map(schedule=>{
    schedule.startTime = new Date(`${date} ${schedule.startTime} GMT+0900`)
    schedule.endTime = new Date(`${date} ${schedule.endTime}  GMT+0900`)
    return schedule
  });
  console.log(data)
});
