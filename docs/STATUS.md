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
