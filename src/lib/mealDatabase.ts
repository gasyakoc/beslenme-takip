import type { FoodItem } from "./types";

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
  // Kahvaltı / Brunch — peynir, yumurta, zeytin, salata yok
  food("yulaf-lapasi", "Yulaf Lapası (süt + muz + bal)", "kahvalti", 250, 280, 10, 6, 48),
  food("tam-bugday-recel", "Tam Buğday Ekmeği + Reçel", "kahvalti", 80, 210, 6, 3, 40),
  food("fistik-ezmesi-ekmek", "Tam Buğday Ekmek + Fıstık Ezmesi", "kahvalti", 70, 260, 10, 12, 28),
  food("muz-smoothie", "Muz-Yulaf Smoothie", "kahvalti", 300, 220, 8, 4, 38),
  food("simit", "Simit", "kahvalti", 100, 280, 9, 6, 48),
  food("ayran-simit", "Simit + Ayran", "kahvalti", 350, 320, 12, 8, 50),
  food("lor-kofte", "Lor Köfte (az yağlı)", "kahvalti", 150, 180, 18, 8, 6),
  food("pankek-muz", "Muzlu Pankek (2 adet)", "kahvalti", 120, 240, 8, 6, 38),
  food("bal-kaymak-az", "Az Kaymak + Bal + Ekmek", "kahvalti", 90, 250, 6, 10, 34),

  // Öğle
  food("tavuk-izgara", "Izgara Tavuk Göğsü + Pilav", "ogle", 300, 380, 38, 8, 36),
  food("kofte-pilav", "Köfte + Bulgur Pilavı", "ogle", 320, 420, 28, 18, 38),
  food("balik-izgara", "Izgara Somon/Balık + Sebze (pişmiş)", "ogle", 280, 340, 32, 14, 22),
  food("mercimek-corbasi", "Mercimek Çorbası + Ekmek", "ogle", 350, 320, 18, 6, 48),
  food("tavuk-sote", "Tavuk Sote + Bulgur", "ogle", 300, 360, 34, 10, 32),
  food("lahmacun", "Lahmacun (1 adet)", "ogle", 180, 280, 14, 10, 34),
  food("doner-durum", "Tavuk Döner Dürüm (az sos)", "ogle", 250, 380, 26, 14, 38),
  food("makarna-domates", "Domates Soslu Makarna", "ogle", 280, 340, 12, 6, 58),
  food("kuru-fasulye", "Kuru Fasulye + Pilav", "ogle", 350, 400, 20, 10, 58),
  food("tavuk-guvec", "Tavuk Güveç (pişmiş sebzeli)", "ogle", 300, 320, 30, 12, 24),

  // Akşam
  food("izgara-kofte", "Izgara Köfte + Salata yerine pişmiş sebze", "aksam", 280, 360, 30, 16, 24),
  food("tavuk-firin", "Fırında Tavuk But (derisiz) + Patates", "aksam", 320, 380, 34, 12, 32),
  food("balik-buğulama", "Buğulama Balık + Pirinç", "aksam", 300, 340, 32, 10, 28),
  food("sebze-guvec", "Etli Sebze Güveci (patlıcan, kabak)", "aksam", 300, 300, 22, 14, 22),
  food("manti-az", "Mantı (küçük porsiyon, yoğurt)", "aksam", 200, 320, 14, 10, 42),
  food("pide-kusbasi", "Kuşbaşılı Pide (yarım)", "aksam", 200, 380, 18, 14, 44),
  food("tavuk-corba", "Tavuk Çorbası + Ekmek", "aksam", 350, 280, 22, 8, 32),
  food("zeytinyagli-fasulye", "Zeytinyağlı Taze Fasulye + Ekmek", "aksam", 300, 260, 10, 8, 38),
  food("karniyarik-az", "Karnıyarık (küçük porsiyon)", "aksam", 250, 320, 16, 18, 24),

  // Ara öğünler
  food("muz", "Muz (1 adet)", "ara1", 120, 105, 1, 0, 27),
  food("elma", "Elma", "ara1", 150, 78, 0, 0, 21),
  food("ceviz-badem", "Ceviz + Badem karışık", "ara1", 30, 190, 6, 17, 4),
  food("protein-bar", "Protein Bar", "ara1", 60, 200, 20, 8, 18),
  food("ayran", "Ayran", "ara1", 200, 60, 4, 2, 6),
  food("yogurt-bal", "Yoğurt + Bal (semizotu yok)", "ara1", 200, 160, 10, 4, 24),
  food("findik", "Fındık (avuç)", "ara2", 25, 160, 4, 15, 4),
  food("cilek", "Çilek", "ara2", 150, 48, 1, 0, 12),
  food("portakal", "Portakal", "ara2", 180, 85, 2, 0, 21),
  food("bitter-cikolata", "Bitter Çikolata (2 kare)", "ara2", 20, 110, 2, 8, 8),
  food("popcorn", "Patlamış Mısır (az tuzlu)", "ara2", 30, 120, 3, 4, 18),
  food("humus-ekmek", "Humus + Tam Buğday Kraker", "ara2", 80, 180, 7, 8, 20),
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
