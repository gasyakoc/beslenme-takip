/**
 * Kişisel beslenme tercihleri — menü filtrelemesinde referans.
 *
 * SEBZE: Genelde sevilmez, nadiren yenir.
 *   İstisna: salata formunda — yoğurtlu semizotu salatası, yeşil/çoban salata
 *   (pişmemiş sebzeler salatada kullanılabilecek olanlar).
 *
 * SABAH: zeytin tercih edilmez (zorunlu değilse).
 * PEYNİR: sevilmez.
 * YUMURTA, SUCUK, SOSIS: alternatif varsa tercih edilmez.
 *
 * Ayrıca sevilmez: muz, yulaf lapası, smoothie, fıstık ezmesi, kaymak,
 * çorba, karnıyarık.
 */

export const DISLIKED_KEYWORDS = [
  "yumurta",
  "sucuk",
  "sosis",
  "peynir",
  "lor",
  "kaşar",
  "hellim",
  "zeytin ",
  "çorba",
  "karnıyarık",
  "muz",
  "yulaf",
  "smoothie",
  "fıstık ezmesi",
  "kaymak",
] as const;

export const PREFERRED_VEG_FORMS = [
  "salata",
  "semizotu",
] as const;
