# Поточний статус системи — SITE-CATALOG

_Last update: 2026-01-17_

---

## Загальний стан

- Код: стабільний
- Збірка: OK
- Типізація: OK
- Архітектура: read-only
- SSOT: Google Sheets (`CATALOG_V2`)
- Гілка: feature/catalog-core
- Production-like URL: https://site-catalog.vercel.app

---

## Phase 1 — Catalog Core

**Status:** COMPLETED ✅

### Реалізовано (факт)

- Home:
  - 4 стартові картки (готові / оправи / чоловічі / жіночі)
- Галереї моделей (Ready / Frames)
- Проміжний екран ready-flow:
  - «Показати всі»
  - «Підібрати під мій зір»
- Фільтр ширини оправи
- Збереження scroll-позиції (back / refresh / F5)
- Сторінка моделі (Model Page)
- Model Page — базова реалізація:
  - mainImage
  - frameWidth (мм)
  - frameHeight (мм)
  - CTA сервісів рендеряться строго по `tryOn / aiPreview`
  - «Дивитись ще» повертає в галерею з контекстом
- Умовні UI-блоки Try-On / AI (без бізнес-логіки)

### Технічний стан

- CSV parser: strict parsing
- Types: узгоджені з data contract
- Selectors: валідація вхідних параметрів
- Data flow:  
  SSOT → parser → types → selectors → UI (OK)

---

## Свідомо НЕ реалізовано (Phase 1)

- Підбір за діоптрією
- Акції / PromoPrice
- Online Try-On (бізнес-логіка)
- AI Preview (бізнес-логіка)
- Оплата / кошик / замовлення

---

## Ключові реалізовані рішення (факт)

### READY / FRAMES logic — SSOT aligned

- READY = `DiopterValues NOT empty`
- FRAMES = `DiopterValues empty`
- CSV parser, типи та селектори вирівняні з SSOT
- UX та URL не змінювались

---

### Model Frame Height — DONE

- Джерело: колонка `Висота оправи (мм)` у SSOT
- Дані проходять повний data-ланцюжок до Model Page
- Умовний рендер (тільки якщо значення є)
- UX-FLOW v1.1 не змінювався

---

## P0 — SitePriceUAH

**Status:** CLOSED ✅

### Summary (fact)

- Додано похідну колонку `SitePriceUAH` у SSOT
- Реалізовано мапінг:
  `PriceIndex → PriceMap → SitePriceUAH`
- Використано канонічний ARRAYFORMULA-патерн
  (з порожнім першим елементом масиву)

### UI

- Model Page та Gallery Page використовують ТІЛЬКИ `SitePriceUAH`
- `Price` та `PriceIndex` повністю виключені з UI
- Fallback:
  - якщо `SitePriceUAH` порожня або некоректна →
    **“Ціну уточнюйте”**

### Result

- P0 блокер знято
- Двоякість ціни усунена
- Каталог готовий до lead-сценаріїв

---

## Phase 2 — Lead Capture (Messenger)

**Status:** CLOSED ✅  
**Date:** 2026-01-14

### Scope Phase 2

- Формування ліда без прийняття продуктових рішень
- Передача контексту менеджеру
- Без зміни UX-FLOW v1.1
- Без оплати, кошика, підбору за діоптріями

### Підтримувані сценарії (факт)

- Готові окуляри (без визначення діоптрій)
- Оправа як товар (без діоптрій)
- Обговорення лінз — виключно через менеджера

---

### Messenger CTA — ACTUAL SNAPSHOT

- Header CTA **«Зв’язатися з менеджером»** присутня на всіх сторінках
- На Model Page передається:
  - `ModelID`
  - `MarketingTitle`
  - `SitePriceUAH`
  - `Image`
  - `ref = site_catalog__model`
- Дубль CTA на сторінці моделі відсутній
- Канал комунікації: **Messenger (ManyChat Entry Point)**

---

### LeadPayload v1 (канонічний)

Передається **СТРОГО**:

- `ModelID`
- `MarketingTitle`
- `SitePriceUAH`
  (рівно те, що показано в UI, включно з текстом **«Ціну уточнюйте»**)
- `Image`
- `ref = site_catalog__model`

**НЕ передається:**
- `Price`
- `PriceIndex`
- будь-які “вгадані” діоптрії
- `DiopterContext` (у Phase 2)

---

### Архітектурне рішення

- Header CTA **НЕ формує payload**
- **Model Page** — єдине канонічне джерело LeadPayload
- Store використовується як SSOT контексту:
  - Model Page → встановлює payload
  - Layout → читає payload або fallback

- UX-FLOW v1.1 **НЕ змінювався**

---

## Phase 3 — Diopter Flow

**Status:** CLOSED ✅

### Реалізовано (факт)

- Сценарій «Для мого зору»
- Вибір **однієї конкретної діоптрії** (±)
- Фільтрація **Ready-моделей** по `DiopterValues`
- Zero-results → автоматичний перехід у Messenger
- Медична логіка **відсутня**
- LeadPayload Phase 2 **не змінений**

---

## Phase 4 — UX Packaging & Copy

**Status:** IN PROGRESS ▶️

---

## Phase 4.1 — Gallery UX Packaging (Mobile-first)

**Status:** CLOSED ✅

Коміт:
- `97f84c1 — Phase 4.1: gallery mobile-first cards with images`

### Реалізовано

- Галерея перероблена з технічного списку на **card-based товарну вітрину**
- Mobile-first layout (2 колонки на смартфоні)
- Картка моделі містить:
  - фото
  - назву
  - ціну (`SitePriceUAH`)
- Використовується реальне фото з SSOT

### Гарантії

- UX-FLOW v1.1 — без змін
- Логіка фільтрації — без змін
- Маршрути та URL — без змін
- CTA / LeadPayload — без змін

---

## Phase 4.2 — Model Page UX Packaging

**Status:** IN PROGRESS ▶️

### Partial progress (WIP)

- Реалізовано full-screen lightbox для фото моделі
- Використано native mobile zoom (pinch / double-tap)
- Прибрано випадковий double-tap zoom  
  (`touch-action: pan-x pan-y`)
- Підсилено backdrop (`rgba(0,0,0,0.9)`)

### Гарантії

- Логіка — без змін
- CTA — без змін
- LeadPayload — без змін
- UX-FLOW v1.1 — без змін

### Примітка

- Інші секції Model Page (hero-ієрархія, інформаційні блоки)
  **ще не опрацьовані**
- Phase 4.2 **НЕ завершена**

---

## Підсумок

- Core, Lead, Diopter Flow — стабільні
- Галерея упакована і готова до показу клієнтам
- Model Page — у процесі UX-пакування
- Система готова до подальшого поетапного UX-допрацювання


## P0 — Performance (Gallery → Model Page)

**Status:** CLOSED ✅  
**Date:** 2026-01-XX

### Issue (fact)
- Зафіксовано регрес продуктивності:
  - перехід **Gallery → Model Page** займав ~4–5 секунд
  - проблема проявлялась на production (особливо mobile)
- UX, маршрути та флоу не змінювались → регрес був неочевидний

### Root cause (fact)
- Проблема **не була повʼязана з каталогом як таким**, а виникла через:
  1. Server-side cache каталогу формально існував, але
     load не був гарантовано server-only
  2. Model Page виконувала **дублюючий fetch + parse каталогу**,
     незважаючи на наявність даних у layout
- Це призводило до повторних мережевих операцій і затримки 4–5 секунд на mobile

### Resolution (fact)
- Відновлено **строгий server-only load** у `+layout.server.ts`
- TTL cache каталогу стабільно працює на сервері
- Прибрано дублюючий fetch каталогу на Model Page
- Model Page використовує дані з layout через `parent()`
- Повністю збережено:
  - UX
  - маршрути
  - поведінку сторінок

### Result
- ⏱️ Gallery → Model Page ≤ ~1s (mobile / desktop)
- 🔁 Повторні переходи без додаткових fetch / parse
- Архітектура відповідає раніше узгодженій server-side моделі
- Регрес продуктивності повністю усунено

Phase 4.2.1 — Hero cleanup (ModelID hidden) — CLOSED

Phase 4.2.2 — CLOSED: Visual Messenger CTA added to Model Page (mobile-safe)