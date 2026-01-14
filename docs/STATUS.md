# Поточний статус системи

## Стан
- Код: стабільний
- Збірка: OK
- Типізація: OK
- Архітектура: read-only

---

## Реалізовано
- Home (4 картки)
- Галереї
- Фільтр ширини оправи
- Scroll persistence
- Сторінка моделі
- Model Page Polish (C): mainImage, frameWidth (mm); CTA сервісів рендериться строго по tryOn / aiPreview; «Дивитись ще» повертає в галерею з контекстом
- Умовний UI Try-On / AI

---

## Не реалізовано (свідомо)
- Підбір за діоптрією
- Акції / PromoPrice
- Online Try-On
- AI Preview (бізнес-логіка)

---

## Ризикові зони
Зміни вимагають повторного аудиту:
- логіка ready / frames
- правило Показувати = Так
- URL-схема
- scroll-механіка

---

## 2026-01-08 — Technical cleanup complete

- Scope: feature/catalog-core
- UX: frozen (no changes)
- Cleanup:
  - catalog/*
  - home config
  - utils
  - routes
- TypeScript: no `any`, explicit types
- Checks: npm run check — OK, npm run build — OK
- State: working tree clean

---

## Messenger CTA — ACTUAL SNAPSHOT

- Header CTA **“Зв’язатися з менеджером”** присутня на всіх сторінках
- На сторінці моделі передається `ref=site_catalog__model_<modelId>`
- Дубль CTA на сторінці моделі прибраний
- Канал комунікації з клієнтом: **Messenger (ManyChat Entry Point)**

---

## Catalog data layer — status

- CSV parser: stabilized (strict boolean parsing)
- Types: aligned with parser contract
- Selectors: validated input params (no unsafe casts)
- Data flow: SSOT → parser → types → selectors (OK)

---

Last update: 2026-01-14

---

[2026-01-14] UX-FLOW v1.1 заморожено.  
Dev-робота дозволена тільки в межах зафіксованого UX.

---

[2026-01-14] DEV-SCOPE (на базі UX-FLOW v1.1)

Дозволено:
- реалізація екранів і переходів згідно UX-FLOW v1.1
- технічні покращення без зміни UX
- рефакторинг, оптимізація, чистка коду
- підготовка фіч-флагів (TryOn / AIPreview) без бізнес-логіки

Заборонено:
- змінювати UX-флоу
- додавати нові екрани або CTA
- реалізовувати підбір за діоптрією
- інтегрувати Online Mirror, AI, оплату

---

[2026-01-14] Ready flow — intermediate screen implemented

Реалізовано проміжний екран для флоу:
Home → Готові (жіночі / чоловічі)

— 2 клікабельні зони без тексту:
  • «Показати всі» → галерея готових  
  • «Підібрати за моїм зором» → окремий флоу підбору  
— Екран показується тільки для category = ready  
— Для frames флоу не змінювався  
— UX-FLOW v1.1 не змінювався

- Gallery: стабілізовано збереження scroll-позиції (refresh, back, F5) для маршрутів /gallery/*

---

READY/FRAMES logic fixed: READY determined by non-empty DiopterValues (SSOT)

CSV parser fixed: DiopterValues mapped, READY gallery now shows data

---

[2026-01-14] READY / FRAMES logic fixed (SSOT-aligned)

— READY визначається як DiopterValues NOT empty  
— FRAMES визначається як DiopterValues empty  
— CSV parser, типи і селектори вирівняні з SSOT  
— UX, URL, фільтри не змінювались

### ✅ Model Frame Height — DONE

**Задача:** Model Frame Height (data contract & parsing)

**Статус:** ЗАВЕРШЕНО

**Опис:**
Додано підтримку висоти оправи (мм) у каталозі моделей.
Поле проходить повний data-ланцюжок від SSOT до UI без зміни UX.

**Реалізація:**
- Google Sheets (CSV): використовується колонка `Висота оправи (мм)`
- CSV parser: значення парситься як `number | null`
- Types: поле `frameHeight` додано до `CatalogItem`
- Selectors: без змін
- Model Page: умовний рендер (показується тільки якщо значення є)

**Перевірки:**
- DATA GATE (реальний CSV з Google Sheets) — OK
- svelte-check — OK
- npm run build — OK
- Browser verification (dev server) — OK

**UX:**
- UX-FLOW v1.1 — без змін
- Layout / тексти / CTA — без змін

**Коміт:**
- add: frameHeight (mm) to catalog contract
