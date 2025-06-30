🧩 Назначение

Программа для пользователей, которые хотят направить трафик только отдельных приложений (например, discord.exe, telegram.exe) через Outline VPN (Shadowsocks), используя конфигурацию Clash for Windows.
📦 Стек технологий
Зона	Технология
Интерфейс	React + TypeScript
Бандлинг	Vite
Стилизация	Tailwind CSS, ShadcnUI
Генерация YAML	js-yaml
Парсинг ss://	Вручную или через утилиту
Desktop-приложение	Electron
IPC взаимодействие	Electron preload + contextBridge
Упаковка .exe	electron-builder
FSD архитектура
📌 Цель MVP

Создать Electron-приложение, которое:

    Принимает от пользователя ss:// ссылку

    Принимает список .exe файлов (одно или несколько)

    Генерирует корректный clash_config.yaml

    Показывает статус (успех/ошибка)

    (опционально) открывает папку с YAML

✅ Функциональные требования
🖥 UI

    - поле ввода ss:// ссылки

    - поле ввода .exe файлов, по одному в строке или через запятую

    - Кнопка Generate YAML

    - Status: надпись об ошибке или успехе

    (опционально) кнопка 📂 Open Output Folder

⚙️ Генерация YAML
Ввод:

    ss:// ссылка:

        Поддержка полной base64 (ss://base64(method:password@host:port))

        И частично закодированных (ss://base64(method:password)@host:port)

    .exe файлы:

        Строка с именами, например:
        discord.exe, telegram.exe, steam.exe

        Или в формате по одной строке

Вывод:

Файл clash_config.yaml должен включать:

proxies:
  - name: "OutlineVPN"
    type: ss
    server: media.example.com
    port: 12345
    cipher: chacha20-ietf-poly1305
    password: your_password
    udp: true

proxy-groups:
  - name: "Proxy"
    type: select
    proxies:
      - "OutlineVPN"
      - DIRECT

rules:
  - PROCESS-NAME,discord.exe,Proxy
  - PROCESS-NAME,telegram.exe,Proxy
  - MATCH,DIRECT

🚧 Обработка ошибок

    Пустой ss:// → ошибка

    Некорректная base64 → ошибка

    Нет .exe → ошибка

    Успешная генерация → сообщение "✅ YAML создан успешно"

📂 Структура проекта

/clash-split-tunnel/
├── electron/
│   ├── main.ts           ← точка входа Electron
│   └── preload.ts        ← безопасный IPC bridge
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── utils/
│   │   ├── parseSs.ts    ← парсинг ss://
│   │   └── generateYaml.ts
│   └── components/
│       └── InputBlock.tsx
├── public/
├── package.json
├── vite.config.ts
├── electron-builder.json

🔁 Поток данных (Flow)

    Пользователь вводит ss:// + .exe

    Нажимает Generate YAML

    Через IPC (Electron preload.ts) передаётся на main process

    Main process сохраняет clash_config.yaml в output/ или рядом

    Возвращается результат (success или error)

    React показывает сообщение

🚀 Готовность MVP =

Интерфейс React готов

Парсинг ss:// работает

Генерация YAML работает

IPC передаёт данные в main

Файл сохраняется

Сообщение об успехе/ошибке видно