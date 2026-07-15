FREAK-CITY — ЗАГРУЗОЧНЫЙ ЭКРАН ДЛЯ GARRY'S MOD

Файлы:
- index.html — основная страница
- style.css — оформление
- script.js — плеер и интеграция с загрузкой GMod
- assets/background.png — фон
- assets/logo.png — логотип
- music/music.mp3 — ваша музыка

КАК ДОБАВИТЬ МУЗЫКУ:
Положите MP3 в папку music и назовите его music.mp3.

КАК УСТАНОВИТЬ:
1. Загрузите всю папку на обычный веб-хостинг с HTTPS.
2. Укажите адрес index.html в sv_loadingurl вашего сервера.

Пример в server.cfg:
sv_loadingurl "https://ваш-сайт.ru/freakcity_loading/index.html"

Важно: локальный путь к файлу не подойдёт — страница должна быть доступна через интернет.
