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

## Messenger CTA — ACTUAL SNAPSHOT

- Header CTA **“Зв’язатися з менеджером”** присутня на всіх сторінках
- На сторінці моделі передається `ref=site_catalog__model_<modelId>`
- Дубль CTA на сторінці моделі прибраний
- Канал комунікації з клієнтом: **Messenger (ManyChat Entry Point)**

## Catalog data layer — status

- CSV parser: stabilized (strict boolean parsing)
- Types: aligned with parser contract
- Selectors: validated input params (no unsafe casts)
- Data flow: SSOT → parser → types → selectors (OK)

Last update: <today date>

[2026-01-14] UX-FLOW v1.1 заморожено.
Dev-робота дозволена тільки в межах зафіксованого UX.

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

READY/FRAMES logic fixed: READY determined by non-empty DiopterValues (SSOT)
