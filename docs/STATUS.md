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

## Phase 4.4 — Model Page: Diopter Context

**Status:** CLOSED ✅

### Реалізовано
- Додано пасивний UI-бейдж з обраною діоптрією на Model Page
- Бейдж показується тільки якщо `diopter` є у query
- Без інтерактивності та без бізнес-логіки

---

## Phase 4.4.1 — Preserve diopter in navigation

**Status:** CLOSED ✅

### Реалізовано
- `diopter` передається напряму в URL Model Page
- `from` використовується лише для back-навігації
- Контекст діоптрії не губиться при переході з галереї

### Result
- Галерея → Model Page → Messenger мають узгоджений diopter-контекст
- Поведінка стабільна при refresh / share URL

### Phase 4.6 — Diopter flow ↔ Model Page (safe return)
**Status:** ✅ CLOSED

- Додано безпечний вхід у diopter-flow зі сторінки моделі
- Реалізовано контрольований return на Model Page
- Виключено порожні галереї
- Визначено fallback у Messenger
- Архітектура відповідає SSOT

P0 BUG: Model Page “Дивитись ще” — nested diopter in from

Status: CLOSED

Fix: sanitize from before back navigation

# STATUS.md — додати (після Phase 5 / або в кінці списку фаз)

## Phase 5.1 — Home Entry (READY_ONLY)

**Status:** CLOSED ✅  
**Date:** 2026-01-27

### Реалізовано (fact)
- Home переведено у режим **READY_ONLY**
- На Home відображаються лише 2 сценарії:
  - «Готові окуляри · Жіночі»
  - «Готові окуляри · Чоловічі»
- Сценарії «Оправи» не рендеряться в UI (без disabled/placeholder)
- UX-FLOW v1.1, маршрути, тексти — без змін

### Result
- Продукт готовий до launch з 2 сценаріями

## Phase 5.2 — Home Entry (Gender-First Copy)

**Status:** CLOSED ✅  
**Date:** 2026-01-27

### Реалізовано
- Home entry copy переведено у **gender-first**
- Основний текст: «Жіночі» / «Чоловічі»
- Контекстний текст: «Готові окуляри»
- Логіка, маршрути, UX-FLOW — без змін

## Phase 5.3 — Home Visual Accent (Contrast · Human · Readable)

**Status:** CLOSED ✅  
**Date:** 2026-01-27

### Реалізовано
- Додано фото-фони для Home entry (жіночі / чоловічі)
- Фото підібрані під ЦА 45–65, без fashion/lifestyle
- Налаштовано overlay для читабельності тексту
- Відкориговано кадрування (обличчя повністю видимі на mobile)
- Перероблено ієрархію тексту:
  - «Жіночі / Чоловічі» — домінантні
  - «Готові окуляри» — чіткий контекст
- UX-FLOW, логіка, маршрути — без змін

### Result
- Home готовий як рекламний entry-екран для FB-аудиторії

## Phase 5.5 — Ready Flow / Second Screen

**Status:** CLOSED ✅  
**Date:** 2026-01-XX

### Реалізовано
- Фінальний UI другого екрану Ready-flow
- Два сценарії:
  - «Підібрати під мій зір» — головний
  - «Показати всі» — другорядний
- Реальні фінальні зображення (без плейсхолдерів)
- Візуально узгоджено з Home
- Логіка, маршрути, UX-FLOW — без змін
<!-- Phase 5.5 closed -->


## Phase 5.5  Ready Flow / Second Screen
**Status:** CLOSED 

## 2026-01-30 — P0: Mobile System Back (Telegram WebView)

**Status:** CLOSED ✅  
**Branch:** feature/catalog-core  
**Result:** Not a product defect — platform limitation (Telegram in-app browser).  
**Action:** SSOT decision recorded in DECISIONS.md. Navigation code kept clean (SPA `goto()`), debug/history hacks removed.

## Phase 6 — Visual Consistency (All Existing Screens)

**Status:** OPEN ▶️  
**Date:** 2026-01-30

### Scope
- Узгодження візуального стилю **ВСІХ ВЖЕ ІСНУЮЧИХ екранів**.
- Home та Ready Second Screen — **візуальний еталон**.

### Included
- кольорова система
- типографіка
- відступи / ритм
- Header (читабельність, розміри, вирівнювання)
- візуальні CTA (без зміни текстів)

### Forbidden
- нові екрани
- нові сценарії
- нові CTA / тексти
- зміни UX-FLOW або логіки

### Goal
- Візуально цілісний продукт на всіх існуючих екранах.

## Global Style Foundation (Pre-Phase 6)

**Status:** CLOSED ✅  
**Date:** 2026-01-30

### Result
- Додано мінімальний global style layer (`app.css`)
- UI більше не browser default
- Жоден екран не рефакторився
- Phase 6 (Visual Consistency) розблокована

## Phase 7 — Gallery UX Redesign (READY)

**Status:** CLOSED ✅  
**Date:** 2026-02-01

### Scope
- Gallery як повноцінний UX-екран перед Model Page
- Diopter flow (plus / minus)
- Viewport-орієнтовані екрани без скролу
- Узгодження з UI tokens Phase 6

### Result
- Gallery має чітку UX-структуру та ієрархію
- Фільтри, grid, empty states працюють стабільно
- Diopter selection screen:
  - без скролу
  - читабельний для ЦА 40–70
  - 2 основні сценарії (плюс / мінус) + менеджер
- Home / Select / Model Page не змінені

MC-6 — IN PROGRESS
MC-6 — CANON FIXED / IN PROGRESS

MC-6 — DONE (endpoint live, payload verified)

MC-6 — DONE (ManyChat Ref URL live, payload -> mc6_payload -> message)
