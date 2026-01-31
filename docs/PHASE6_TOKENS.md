# Phase 6 - Canonical UI Tokens (FROZEN)

## STATUS
- Home / Select / Model Page - ETALON
- UX-FLOW v1.1 - FROZEN
- Ці токени ВИТЯГНУТІ з існуючих екранів
- ЗАБОРОНЕНО застосовувати їх ретроактивно до еталонів

---

## 1. Spacing / Rhythm

### Page padding
- Mobile: 16px
- Desktop: 16-32px
- Sticky bottom reserve: 96px

### Section gaps
- XS: 10px
- S: 12px
- M: 16px
- L: 20px

### Inline padding (controls / cards)
- 12px
- 14px
- 16px
- 18px

---

## 2. Border Radius

- XS: 12px
- S: 14px
- M: 16px
- L: 18px
- XL (cards / CTA): 22px
- Pill / badge: 999px

---

## 3. Typography Scale

### Titles / Hero
- Size: 34-40px
- Weight: 800-900
- Line-height: ~1.05-1.15

### Card titles / Primary CTA
- Size: 18-20px
- Weight: 800-900

### Body / Specs
- Size: 14-15px
- Weight: 600-800

### Meta / Labels
- Size: 13-14px
- Weight: 700-800

WARNING: Гарнітура не вважається канонічною
WARNING: Може бути змінена ТІЛЬКИ з окремого продуктового дозволу

---

## 4. Colors (Observed, non-design)

### Base
- Black: #000000
- White: #ffffff
- Text gray: #555555

### Light surfaces
- rgba(0,0,0,0.04)
- rgba(0,0,0,0.05)
- rgba(0,0,0,0.06)

### Overlays / Backdrops
- rgba(0,0,0,0.45)
- rgba(0,0,0,0.9)
- rgba(255,255,255,0.92)

---

## 5. Surfaces / Cards

- Always on light surface over base background
- Border: 1px solid rgba(0,0,0,0.12)
- Radius: 18-22px
- Shadow: soft only, optional
- Content never flush to edge

---

## 6. CTA Rules

### Primary CTA
- Background: black
- Text: white
- Radius: 22px
- Font-weight: 900
- Padding: 14-18px

### Secondary / Ghost
- Background: transparent
- Border: 1px solid rgba(0,0,0,0.12)
- Same geometry as primary

### Interaction
- Active: scale 0.98-0.99
- Hover (if exists): scale ~1.01

---

## 7. Applicability

APPLY TO:
- Нові екрани
- Нефіналізовані екрани
- Майбутні сценарії

DO NOT APPLY TO:
- Home (/)
- Select (Ready Second Screen)
- Model Page (/model/[modelId])

---

## 8. Governance

- Будь-яка зміна цього файлу = нова Phase / explicit approval
- Локальні правки без фіксації - ЗАБОРОНЕНІ