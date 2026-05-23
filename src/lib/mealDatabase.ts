import type { FoodItem } from "./types";

/**
 * Kalori/makro değerleri porsiyon bazlıdır (toplam tabak).
 * Kaynaklar: TUBITAK besin tablosu, diyetisyen veri tabanları, standart TR porsiyonları.
 * Diyet hedefi: ~1362 kcal/gün, protein ≥99g — yüksek proteinli seçenekler öncelikli.
 */

function food(
  id: string,
  name: string,
  category: FoodItem["category"],
  defaultGrams: number,
  calories: number,
  protein: number,
  fat: number,
  carbs: number,
  unit = "g"
): FoodItem {
  return {
    id,
    name,
    category,
    defaultGrams,
    unit,
    calories,
    protein,
    fat,
    carbs,
  };
}

export const FOOD_DATABASE: FoodItem[] = [
  // Kahvaltı / Brunch — yumurta, peynir, zeytin, yulaf, muz, smoothie, fıstık ezmesi, kaymak yok
  food("tam-bugday-recel", "Tam Buğday Ekmeği + Reçel", "kahvalti", 70, 195, 5, 2, 38),
  food("tam-bugday-domates", "Tam Buğday Tost + Domates", "kahvalti", 90, 185, 6, 3, 32),
  food("bazlama-bal", "Bazlama + Bal", "kahvalti", 80, 210, 5, 3, 42),
  food("avokado-ekmek", "Avokado + Tam Buğday Ekmek", "kahvalti", 130, 245, 6, 14, 24),
  food("tavuk-ekmek-brunch", "Izgara Tavuk Göğsü + Ekmek", "kahvalti", 180, 295, 32, 5, 28),
  food("simit", "Simit (1 adet)", "kahvalti", 100, 275, 9, 7, 44),
  food("ayran-simit", "Simit + Ayran", "kahvalti", 300, 335, 13, 8, 48),

  // Öğle — çorba yok; protein + kontrollü karbonhidrat
  // 100g tavuk göğsü ~165 kcal + 150g pilav ~230 kcal
  food("tavuk-izgara", "Izgara Tavuk Göğsü + Pilav", "ogle", 250, 395, 36, 8, 38),
  food("tavuk-sote", "Tavuk Sote + Bulgur", "ogle", 280, 370, 35, 9, 34),
  food("tavuk-guvec", "Tavuk Güveç (pişmiş sebzeli)", "ogle", 280, 310, 32, 10, 22),
  food("kofte-pilav", "Izgara Köfte + Bulgur Pilavı", "ogle", 300, 410, 30, 16, 36),
  food("balik-izgara", "Izgara Balık + Pişmiş Sebze", "ogle", 260, 330, 34, 12, 18),
  food("lahmacun", "Lahmacun (1 adet, orta)", "ogle", 120, 185, 10, 7, 22),
  food("doner-durum", "Tavuk Döner Dürüm (az soslu)", "ogle", 220, 420, 28, 14, 42),
  food("makarna-domates", "Domates Soslu Makarna (küçük porsiyon)", "ogle", 220, 300, 11, 5, 52),
  food("kuru-fasulye", "Kuru Fasulye + Az Pilav", "ogle", 320, 380, 18, 9, 52),
  food("tavuk-sis", "Tavuk Şiş + Bulgur", "ogle", 270, 360, 34, 8, 32),

  // Akşam — çorba ve karnıyarık yok
  food("izgara-kofte", "Izgara Köfte + Pişmiş Sebze", "aksam", 260, 340, 28, 14, 22),
  food("tavuk-firin", "Fırında Tavuk (derisiz) + Patates", "aksam", 300, 370, 36, 10, 30),
  food("balik-buğulama", "Buğulama Balık + Az Pirinç", "aksam", 280, 330, 33, 9, 26),
  food("sebze-guvec", "Etli Sebze Güveci (patlıcan, kabak)", "aksam", 280, 290, 22, 12, 20),
  food("manti-az", "Mantı (küçük porsiyon, yoğurt)", "aksam", 180, 300, 13, 9, 40),
  food("pide-kusbasi", "Kuşbaşılı Pide (yarım)", "aksam", 180, 360, 16, 12, 46),
  food("zeytinyagli-fasulye", "Zeytinyağlı Taze Fasulye + Ekmek", "aksam", 280, 250, 9, 7, 36),
  food("levrek-izgara", "Izgara Levrek + Pişmiş Sebze", "aksam", 260, 320, 32, 11, 16),
  food("tavuk-izgara-salata-yok", "Izgara Tavuk + Fırın Sebze", "aksam", 250, 300, 34, 8, 18),

  // Ara öğünler — muz yok
  food("elma", "Elma", "ara1", 150, 78, 0, 0, 21),
  food("armut", "Armut", "ara1", 150, 85, 0, 0, 22),
  food("ceviz-badem", "Ceviz + Badem (1 avuç)", "ara1", 25, 165, 5, 15, 4),
  food("protein-bar", "Protein Bar", "ara1", 60, 200, 20, 8, 18),
  food("ayran", "Ayran", "ara1", 200, 60, 4, 2, 6),
  food("yogurt-bal", "Yoğurt + Bal", "ara1", 180, 145, 10, 3, 20),
  food("kefir", "Kefir", "ara1", 200, 90, 7, 3, 10),
  food("findik", "Fındık (1 avuç)", "ara2", 20, 130, 3, 12, 3),
  food("cilek", "Çilek", "ara2", 150, 48, 1, 0, 12),
  food("portakal", "Portakal", "ara2", 180, 85, 2, 0, 21),
  food("uzum", "Üzüm (1 avuç)", "ara2", 100, 70, 1, 0, 18),
  food("bitter-cikolata", "Bitter Çikolata (2 kare)", "ara2", 20, 110, 2, 8, 8),
  food("popcorn", "Patlamış Mısır (az tuzlu)", "ara2", 25, 95, 3, 3, 14),
  food("humus-ekmek", "Humus + Tam Buğday Kraker", "ara2", 80, 175, 7, 7, 20),
];

export function getFoodsByCategory(category: FoodItem["category"]): FoodItem[] {
  return FOOD_DATABASE.filter(
    (f) => f.category === category || f.category === "genel"
  );
}

export function scaleFood(food: FoodItem, grams: number): FoodItem {
  const ratio = grams / food.defaultGrams;
  return {
    ...food,
    defaultGrams: grams,
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
  };
}