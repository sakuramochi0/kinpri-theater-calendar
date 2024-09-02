import { globSync, readFileSync, writeFileSync } from 'node:fs'

import Mustache from 'mustache'

type Calendar = {
  theaterName: string
  icalURL: string
  jsonURL: string
}

function main() {
  const template = readFileSync('README.md.mustache', 'utf-8')
  const calendars: Calendar[] = getCalendars()
  const rendered = Mustache.render(template, { calendars })
  writeFileSync('README.md', rendered)
}

function getCalendars(): Calendar[] {
  const icalFilenames = globSync('data/*.ics')
  return icalFilenames.map(ical => {
    const rawBasename = ical.replace('.ics', '').replace('data/', '')
    const theaterName = rawBasename.replace(' 『KING OF PRISM -Dramatic PRISM.1-』上映時間', '')
    const basename = encodeURIComponent(rawBasename)
    const baseURL = `https://kinpri-theater-calendar.skrm.ch/data/`;
    const icalURL = `${baseURL}${basename}.ics`
    const jsonURL = `${baseURL}${basename}.json`
    return {theaterName, icalURL, jsonURL}
  })
}

main()
