# kinpri-theater-calendar

📆 キンプリの映画の上映スケジュールをiCalとして生成するプログラム。Googleカレンダーなどのカレンダーアプリに登録すると自動更新されて最新のスケジュールが確認できます。

<img alt="新宿バルト9のキンプリ上映スケジュールが表示されたGoogleカレンダーのスクリーンショット" src="https://github.com/user-attachments/assets/8346d48b-2f12-4c0c-9a21-c108cfc5e6ff" width="300">
<img alt="新宿バルト9とユナイテッド・シネマ幕張のキンプリ上映スケジュールが表示されたカレンダーアプリのスクリーンショット" src="https://github.com/user-attachments/assets/ffdbfe45-b7f7-4fd9-b132-31a3127a2399" width="300">

## 現在の対応映画館

Googleカレンダーなどに読み込むときには、iCalをダウンロードするのではなく、URLをコピーしてカレンダーアプリにURLからカレンダーを追加する操作をしてください。iCalをダウンロードしてしまうと、ダウンロードした時点のスケジュールしか読み込まれず、自動更新されなくなってしまいます。

- 新宿バルト9
  - iCal URL: https://kinpri-theater-calendar.skrm.ch//data/新宿バルト9%20『KING%20OF%20PRISM%20-Dramatic%20PRISM.1-』上映時間.ics
  - JSON link: https://kinpri-theater-calendar.skrm.ch//data/新宿バルト9%20『KING%20OF%20PRISM%20-Dramatic%20PRISM.1-』上映時間.json
- ユナイテッド・シネマ幕張
  - iCal URL: https://kinpri-theater-calendar.skrm.ch//data/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%83%BB%E3%82%B7%E3%83%8D%E3%83%9E%E5%B9%95%E5%BC%B5%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics
  - JSON link: https://kinpri-theater-calendar.skrm.ch/data/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%83%BB%E3%82%B7%E3%83%8D%E3%83%9E%E5%B9%95%E5%BC%B5%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json
- グランドシネマサンシャイン池袋
  - iCal URL: https://kinpri-theater-calendar.skrm.ch/data/%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E3%82%B5%E3%83%B3%E3%82%B7%E3%83%A3%E3%82%A4%E3%83%B3%E6%B1%A0%E8%A2%8B%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.ics
  - JSON URL: https://kinpri-theater-calendar.skrm.ch/data/%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B7%E3%83%8D%E3%83%9E%E3%82%B5%E3%83%B3%E3%82%B7%E3%83%A3%E3%82%A4%E3%83%B3%E6%B1%A0%E8%A2%8B%20%E3%80%8EKING%20OF%20PRISM%20-Dramatic%20PRISM.1-%E3%80%8F%E4%B8%8A%E6%98%A0%E6%99%82%E9%96%93.json

## 現在の対応作品
- 『KING OF PRISM -Dramatic PRISM.1-』

## 既知の問題
- 終了時刻が24:00を超える場合、実際より短い23:59に固定される。

## ToDo
- [ ] 応援上映かどうかが分かるようにする
- [ ] 新宿バルト9の当日以外のスケジュールも集める
- [ ] データをGitHub Actionsで自動更新する
- [ ] 空席情報を追加する
- [ ] ホームページ（`index.html`）を作る
- [ ] いろいろな映画館にも対応する
  - [x] 新宿バルト9
  - [x] ユナイテッド・シネマ幕張
  - [x] グランドシネマサンシャイン池袋
