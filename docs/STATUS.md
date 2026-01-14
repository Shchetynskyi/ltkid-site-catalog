# Поточний статус системи — SITE-CATALOG

## Загальний стан
- Код: стабільний
- Збірка: OK
- Типізація: OK
- Архітектура: read-only
- Гілка: feature/catalog-core

---

## Реалізовано

- Home (4 стартові картки)
- Галереї моделей
- Проміжний екран для ready-флоу (показати всі / підібрати за зором)
- Фільтр ширини оправи
- Збереження scroll-позиції (back / refresh / F5)
- Сторінка моделі
- Model Page Polish (C):
  - mainImage
  - frameWidth (мм)
  - CTA сервісів рендеряться строго по tryOn / aiPreview
  - «Дивитись ще» повертає в галерею з контекстом
- Умовний UI Try-On / AI (без бізнес-логіки)

---

## Свідомо НЕ реалізовано

- Підбір за діоптрією
- Акції / PromoPrice
- Online Try-On
- AI Preview (бізнес-логіка)
- Оплата / замовлення / кошик

---

## Ризикові зони (вимагають повторного аудиту)

- Логіка ready / frames
- Правило `Показувати = Так`
- URL-схема галерей
- Scroll-механіка

---

## 2026-01-08 — Technical cleanup complete

- Scope: feature/catalog-core
- UX: frozen (без змін)
- Cleanup:
  - catalog/*
  - home config
  - utils
  - routes
- TypeScript: без `any`, явні типи
- Checks:
  - `npm run check` — OK
  - `npm run build` — OK
- State: working tree clean

---

## Messenger CTA — ACTUAL SNAPSHOT

- Header CTA **«Зв’язатися з менеджером»** присутня на всіх сторінках
- На сторінці моделі передається `ref=site_catalog__model_<modelId>`
- Дубль CTA на сторінці моделі прибраний
- Канал комунікації: **Messenger (ManyChat Entry Point)**

---

## Catalog data layer — status

- CSV parser: стабілізований (strict parsing)
- Types: узгоджені з data contract
- Selectors: валідація вхідних параметрів
- Data flow: SSOT → parser → types → selectors → UI (OK)

---

## Governance

### [2026-01-14] UX-FLOW v1.1 заморожено
Dev-робота дозволена **тільки** в межах зафіксованого UX.

---

### [2026-01-14] DEV-SCOPE (на базі UX-FLOW v1.1)

**Дозволено:**
- реалізація екранів і переходів згідно UX-FLOW v1.1
- технічні покращення без зміни UX
- рефакторинг, оптимізація, чистка коду
- підготовка фіч-флагів (TryOn / AIPreview) без бізнес-логіки

**Заборонено:**
- змінювати UX-флоу
- додавати нові екрани або CTA
- реалізовувати підбір за діоптрією
- інтегрувати Online Mirror, AI, оплату

---

## Ключові реалізовані зміни

### [2026-01-14] Ready flow — intermediate screen implemented

- Реалізовано проміжний екран для флоу:
  Home → Готові (жіночі / чоловічі)
- 2 клікабельні зони без тексту:
  - «Показати всі» → галерея готових
  - «Підібрати за моїм зором» → окремий флоу підбору
- Екран показується тільки для category = ready
- Для frames флоу не змінювався
- UX-FLOW v1.1 не змінювався

---

### [2026-01-14] READY / FRAMES logic fixed (SSOT-aligned)

- READY визначається як `DiopterValues NOT empty`
- FRAMES визначається як `DiopterValues empty`
- CSV parser, типи і селектори вирівняні з SSOT
- UX, URL і фільтри не змінювались

---

### [2026-01-14] Model Frame Height — DONE

- Додано підтримку висоти оправи (мм) у data contract
- Джерело: колонка `Висота оправи (мм)` у SSOT (Google Sheets CSV)
- Значення проходить повний data-ланцюжок до Model Page
- Умовний рендер: показується тільки якщо значення є
- UX-FLOW v1.1 не змінювався

---

_Last update: 2026-01-14_
