# Поточний статус системи — SITE-CATALOG

_Last update: 2026-01-16_

---

## Загальний стан

- Код: стабільний
- Збірка: OK
- Типізація: OK
- Архітектура: read-only
- SSOT: Google Sheets (`CATALOG_V2`)
- Гілка: feature/catalog-core

---

## Phase 1 — Catalog Core

**Status:** COMPLETED ✅

### Реалізовано

- Home (4 стартові картки)
- Галереї моделей
- Проміжний екран ready-флоу:
  - «Показати всі»
  - «Підібрати за моїм зором»
- Фільтр ширини оправи
- Збереження scroll-позиції (back / refresh / F5)
- Сторінка моделі
- Model Page Polish:
  - mainImage
  - frameWidth (мм)
  - frameHeight (мм)
  - CTA сервісів рендеряться строго по `tryOn / aiPreview`
  - «Дивитись ще» повертає в галерею з контекстом
- Умовний UI Try-On / AI (без бізнес-логіки)

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

### Status: CLOSED ✅

**Summary (fact):**
- Додано похідну колонку `SitePriceUAH` у SSOT
- Реалізовано мапінг:
  `PriceIndex → PriceMap → SitePriceUAH`
- Використано канонічний ARRAYFORMULA-патерн
  (з порожнім першим елементом масиву)

**UI:**
- Model Page та Gallery Page використовують ТІЛЬКИ `SitePriceUAH`
- `Price` та `PriceIndex` повністю виключені з UI
- Fallback:
  - якщо `SitePriceUAH` порожня або некоректна →
    **“Ціну уточнюйте”**

**Result:**
- P0 блокер знято
- Двоякість ціни усунена
- Каталог готовий до Phase 2

---

## Messenger CTA — ACTUAL SNAPSHOT

- Header CTA **«Зв’язатися з менеджером»** присутня на всіх сторінках
- На Model Page передається:
  - `ModelID`
  - `SitePriceUAH`
  - `ref=site_catalog__model_<modelId>`
- Дубль CTA на сторінці моделі відсутній
- Канал комунікації: **Messenger (ManyChat Entry Point)**

---

## Phase 2 — Order / Lead Capture

**Status:** ACTIVE ▶️

### Scope Phase 2

- Формування ліда без прийняття продуктових рішень
- Передача контексту менеджеру
- Без зміни UX-FLOW v1.1
- Без оплати, кошика, підбору за діоптріями

### Підтримувані сценарії (факт)

- Готові окуляри (без визначення діоптрій)
- Аправа як товар (без діоптрій)
- Обговорення лінз — виключно через менеджера

---

## Governance

### UX-FLOW

- UX-FLOW v1.1 — **FROZEN**
- Будь-які зміни UX:
  - тільки через нове рішення
  - з новою версією UX-FLOW

### DEV-SCOPE

**Дозволено:**
- реалізація логіки Phase 2 (lead capture)
- технічні покращення без зміни UX
- рефакторинг, оптимізація, чистка коду

**Заборонено:**
- змінювати UX-флоу
- додавати нові CTA або кнопки
- реалізовувати підбір за діоптрією
- інтегрувати оплату, AI, Online Mirror

- [Phase 2] Model Page встановлює canonical LeadPayload v1 (ModelID, MarketingTitle, SitePriceUAH, Image, ref=site_catalog__model).

## Phase 2 — Lead Capture (Messenger) — ACTUAL SNAPSHOT

**Status:** CLOSED ✅  
**Date:** 2026-01-14

### Що реалізовано (факт)

Реалізовано канонічну передачу контексту ліда з **Model Page** у Messenger
відповідно до SSOT (`DECISIONS.md`, LeadPayload v1).

Клік **«Звʼязатися з менеджером»** на сторінці моделі:
- відкриває Messenger (ManyChat Entry Point)
- передає повний, стандартизований контекст
- однаковий payload бачать і клієнт, і менеджер

---

### LeadPayload v1 (канонічний)

Передається **СТРОГО**:

- `ref = site_catalog__model`
- `ModelID`
- `MarketingTitle`
- `SitePriceUAH`  
  (рівно те, що показано в UI, включно з текстом **«Ціну уточнюйте»**)
- `Image`  
  (те саме зображення, яке бачив користувач на Model Page)

**НЕ передається:**
- `Price`
- `PriceIndex`
- будь-які “вгадані” діоптрії
- `DiopterContext`  
  (Phase 2 не включає сценарій «Для мого зору»)

---

### Архітектурне рішення

- Header CTA **НЕ формує payload**
- **Model Page** є єдиним канонічним джерелом LeadPayload
- Використано store як SSOT контексту:
  - Model Page → встановлює payload
  - Layout → читає payload  
    або використовує fallback `ref = site_catalog__from_site`
- UX-FLOW v1.1 **НЕ змінювався**

---

### Перевірка

- Payload підтверджено на рівні згенерованого `m.me` URL
- Обмеження Messenger / ManyChat враховані
- Реальна передача працює стабільно

---

### Висновок

- Phase 2 — Lead Capture реалізовано повністю та коректно
- Контекст ліда стандартизований і прозорий для клієнта
- Готово до використання менеджерами без додаткових UX або data-змін

# STATUS UPDATE — Phase 4.1 (Gallery UX Packaging, Mobile-first)

## Статус
✅ **Phase 4.1 — ЗАВЕРШЕНО**

Коміт:
- `97f84c1 — Phase 4.1: gallery mobile-first cards with images`

## Що зроблено
- Галерея моделей перероблена з технічного списку на **card-based товарну вітрину**
- Реалізовано **mobile-first layout** (2 колонки на смартфоні)
- Кожна модель відображається як окрема картка:
  - фото моделі
  - назва
  - ціна
- Галерея стабільно відображає **реальні фото моделей** (використовується те саме джерело, що і на сторінці моделі)

## Технічні гарантії
- UX-FLOW v1.1 **не змінено**
- Логіка фільтрації **не змінена**
- Маршрути та URL **не змінені**
- Нові CTA **не додавались**
- Існуючі CTA **не змінювались**
- LeadPayload / Phase 2 / Phase 3 **не зачеплені**
- Зміни обмежені лише UI/UX пакуванням галереї

## Результат
- Галерея більше не виглядає як прототип або технічна сторінка
- Mobile UX сприймається як нормальна товарна вітрина
- Сайт **не соромно давати клієнтам** для перегляду моделей
- Блок готовий до зовнішнього UX-тестування

## Далі
Phase 4.1 закрита. Можливий перехід до наступної підфази Phase 4.
