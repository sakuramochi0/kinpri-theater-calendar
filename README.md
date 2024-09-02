# kinpri-theater-calendar

📆 キンプリの映画の上映スケジュールをiCalとして生成するプログラム。Googleカレンダーなどのカレンダーアプリに登録すると自動更新されて最新のスケジュールが確認できます。

何らかの理由でカレンダーが正しく更新されない場合もあるので、予約前にリンクから映画館のスケジュールページも確認するようにしてください。

<img alt="新宿バルト9のキンプリ上映スケジュールが表示されたGoogleカレンダーのスクリーンショット" src="https://github.com/user-attachments/assets/8346d48b-2f12-4c0c-9a21-c108cfc5e6ff" width="300">
<img alt="新宿バルト9とユナイテッド・シネマ幕張のキンプリ上映スケジュールが表示されたカレンダーアプリのスクリーンショット" src="https://github.com/user-attachments/assets/ffdbfe45-b7f7-4fd9-b132-31a3127a2399" width="300">

## 現在の対応映画館

Googleカレンダーなどに読み込むときには、iCalをダウンロードするのではなく、URLをコピーしてカレンダーアプリにURLからカレンダーを追加する操作をしてください。iCalをダウンロードしてしまうと、ダウンロードした時点のスケジュールしか読み込まれず、自動更新されなくなってしまいます。

| 映画館 | iCalへのリンク | JSONへのリンク |
| -- | -- | -- |
| T・ジョイ パークプレイス 大分 | [T・ジョイ パークプレイス 大分 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%20%E3%83%91%E3%83%BC%E3%82%AF%E3%83%97%E3%83%AC%E3%82%A4%E3%82%B9%20%E5%A4%A7%E5%88%86%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ パークプレイス 大分 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%20%E3%83%91%E3%83%BC%E3%82%AF%E3%83%97%E3%83%AC%E3%82%A4%E3%82%B9%20%E5%A4%A7%E5%88%86%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ リバーウォーク 北九州 | [T・ジョイ リバーウォーク 北九州 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%20%E3%83%AA%E3%83%90%E3%83%BC%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%AF%20%E5%8C%97%E4%B9%9D%E5%B7%9E%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ リバーウォーク 北九州 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%20%E3%83%AA%E3%83%90%E3%83%BC%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%AF%20%E5%8C%97%E4%B9%9D%E5%B7%9E%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ京都 | [T・ジョイ京都 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E4%BA%AC%E9%83%BD%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ京都 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E4%BA%AC%E9%83%BD%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ博多 | [T・ジョイ博多 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E5%8D%9A%E5%A4%9A%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ博多 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E5%8D%9A%E5%A4%9A%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ新潟万代 | [T・ジョイ新潟万代 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E6%96%B0%E6%BD%9F%E4%B8%87%E4%BB%A3%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ新潟万代 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E6%96%B0%E6%BD%9F%E4%B8%87%E4%BB%A3%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ梅田 | [T・ジョイ梅田 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E6%A2%85%E7%94%B0%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ梅田 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E6%A2%85%E7%94%B0%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ蘇我 | [T・ジョイ蘇我 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E8%98%87%E6%88%91%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ蘇我 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E8%98%87%E6%88%91%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| T・ジョイ長岡 | [T・ジョイ長岡 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E9%95%B7%E5%B2%A1%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [T・ジョイ長岡 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/T%E3%83%BB%E3%82%B8%E3%83%A7%E3%82%A4%E9%95%B7%E5%B2%A1%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| グランドシネマサンシャイン池袋 | [グランドシネマサンシャイン池袋 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E3%82%B5%E3%83%B3%E3%82%B7%E3%83%A3%E3%82%A4%E3%83%B3%E6%B1%A0%E8%A2%8B%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [グランドシネマサンシャイン池袋 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E3%82%B5%E3%83%B3%E3%82%B7%E3%83%A3%E3%82%A4%E3%83%B3%E6%B1%A0%E8%A2%8B%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| ユナイテッド・シネマ幕張 | [ユナイテッド・シネマ幕張 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%83%BB%E3%82%B7%E3%83%8D%E3%83%9E%E5%B9%95%E5%BC%B5%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [ユナイテッド・シネマ幕張 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%83%BB%E3%82%B7%E3%83%8D%E3%83%9E%E5%B9%95%E5%BC%B5%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| 広島バルト11 | [広島バルト11 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E5%BA%83%E5%B3%B6%E3%83%90%E3%83%AB%E3%83%8811%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [広島バルト11 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E5%BA%83%E5%B3%B6%E3%83%90%E3%83%AB%E3%83%8811%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| 新宿バルト9 | [新宿バルト9 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E6%96%B0%E5%AE%BF%E3%83%90%E3%83%AB%E3%83%889%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [新宿バルト9 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E6%96%B0%E5%AE%BF%E3%83%90%E3%83%AB%E3%83%889%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| 横浜ブルク13 | [横浜ブルク13 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E6%A8%AA%E6%B5%9C%E3%83%96%E3%83%AB%E3%82%AF13%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [横浜ブルク13 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E6%A8%AA%E6%B5%9C%E3%83%96%E3%83%AB%E3%82%AF13%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |
| 鹿児島ミッテ10 | [鹿児島ミッテ10 『KING OF PRISM -Dramatic PRISM.1-』上映時間.ics](https://kinpri-theater-calendar.skrm.ch/data/%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%9F%E3%83%83%E3%83%8610%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics) | [鹿児島ミッテ10 『KING OF PRISM -Dramatic PRISM.1-』上映時間.json](https://kinpri-theater-calendar.skrm.ch/data/%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%9F%E3%83%83%E3%83%8610%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json) |

## 現在の対応作品
- 『KING OF PRISM -Dramatic PRISM.1-』

## 既知の問題
- 終了時刻が24:00を超える場合、実際より短い23:59に固定される。

## ToDo
- [ ] 応援上映かどうかが分かるようにタイトルを含める
- [x] データをGitHub Actionsで自動更新する
- [ ] 空席情報（○・△・☓）を追加する
- [x] ホームページ（`index.html`）を作る
- [ ] いろいろな映画館にも対応する
  - [ ] 新宿バルト9
    - [x] 当日
    - [ ] 週間スケジュール
  - [ ] ユナイテッド・シネマ幕張
    - [x] 当日
    - [ ] 週間スケジュール
  - [x] グランドシネマサンシャイン池袋
  - [ ] TOHOシネマズ 流山おおたかの森

## Links

- [GitHub repository](https://github.com/sakuramochi0/kinpri-theater-calendar)
