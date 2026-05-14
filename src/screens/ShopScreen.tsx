import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { ProfileHeaderButton } from "../components/ProfileHeaderButton";
import { CATEGORY_LABELS, SHOP_ITEMS } from "../data/shopItems";
import type { ShopItem } from "../types";

type Category = ShopItem["category"];
const CATEGORIES: Category[] = ["hat", "ship", "pet", "decoration"];

export function ShopScreen() {
  const navigate = useNavigate();
  const profile = useGameStore((s) => s.profile);
  const inventory = useGameStore((s) => s.inventory);
  const buyItem = useGameStore((s) => s.buyItem);
  const equipItem = useGameStore((s) => s.equipItem);

  const [selectedCategory, setSelectedCategory] = useState<Category>("hat");
  const [purchasedItem, setPurchasedItem] = useState<ShopItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  const itemsInCategory = SHOP_ITEMS.filter((i) => i.category === selectedCategory);

  const handleBuy = (item: ShopItem) => {
    setErrorMsg(null);
    if (inventory.ownedItems.includes(item.id)) {
      equipItem(item.category, item.id);
      return;
    }
    if (inventory.pearls < item.priceInPearls) {
      setErrorMsg(`אין מספיק פנינים. דרושות עוד ${item.priceInPearls - inventory.pearls} פנינים.`);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    const ok = buyItem(item.id, item.priceInPearls);
    if (ok) {
      setPurchasedItem(item);
      equipItem(item.category, item.id);
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-0 w-full overflow-x-hidden overflow-y-auto flex flex-col px-2 py-2 bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100" dir="rtl">
      {/* כותרת */}
      <div className="flex items-center justify-between gap-1 mb-2 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/90 rounded-full px-3 py-1.5 shadow font-bold text-stone-700 text-sm active:scale-95 shrink-0"
        >
          ⬅ חזרה
        </button>
        <div className="flex-1 min-w-0 flex justify-center px-1">
          <div className="text-base sm:text-xl font-black text-amber-800 truncate text-center">
            🏪 חנות הפיראטים
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 min-w-0">
          <ProfileHeaderButton className="max-w-[40vw] sm:max-w-[9rem]" />
          <div className="bg-amber-400/95 rounded-full px-2 py-1 shadow font-black text-white text-sm flex items-center gap-1 shrink-0">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 border border-white shrink-0" />
            <span>{inventory.pearls}</span>
          </div>
        </div>
      </div>

      {/* תיאור התוכי */}
      <div className="flex items-center gap-2 mb-3 shrink-0 bg-white/80 rounded-2xl border-2 border-amber-300 shadow p-2 relative">
        <Parrot size={48} mood="happy" />
        <div className="flex-1 text-xs sm:text-sm font-bold text-stone-700 leading-tight min-w-0">
          ברוך הבא לחנות שלי, פיראט!
          <br />
          <span className="text-stone-500 font-normal">
            כל פנינה שאספת היא מטבע יקרה. בחר בחוכמה.
          </span>
        </div>
      </div>

      {/* קטגוריות */}
      <div className="flex flex-wrap justify-center gap-1 mb-2 shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-lg px-2 py-1.5 font-bold text-xs shadow transition-all active:scale-95 ${
              selectedCategory === cat
                ? "bg-amber-500 text-white"
                : "bg-white/80 text-stone-700 hover:bg-amber-100"
            }`}
          >
            {CATEGORY_LABELS[cat].emoji} {CATEGORY_LABELS[cat].label}
          </button>
        ))}
      </div>

      {/* פריטים */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-x-hidden overflow-y-auto content-start auto-rows-min pb-1">
        {itemsInCategory.map((item) => {
          const isOwned = inventory.ownedItems.includes(item.id);
          const isEquipped = inventory.equippedItems[item.category] === item.id;
          const canAfford = inventory.pearls >= item.priceInPearls;
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl p-2 border-2 shadow ${
                isEquipped
                  ? "bg-emerald-50 border-emerald-400"
                  : isOwned
                  ? "bg-amber-50 border-amber-300"
                  : canAfford
                  ? "bg-white border-amber-200"
                  : "bg-stone-100 border-stone-300 opacity-70"
              }`}
            >
              <div className="text-3xl text-center mb-0.5">{item.emoji}</div>
              <div className="text-xs font-black text-stone-800 text-center leading-tight line-clamp-2">
                {item.name}
              </div>
              <div className="text-[9px] text-stone-500 text-center my-0.5 leading-tight line-clamp-2 min-h-[24px]">
                {item.description}
              </div>
              <button
                onClick={() => handleBuy(item)}
                className={`w-full mt-1 rounded-xl py-1.5 font-black text-xs shadow ${
                  isEquipped
                    ? "bg-emerald-500 text-white"
                    : isOwned
                    ? "bg-amber-400 text-white"
                    : canAfford
                    ? "bg-amber-500 text-white active:scale-95"
                    : "bg-stone-400 text-white"
                }`}
              >
                {isEquipped ? (
                  "✓ בשימוש"
                ) : isOwned ? (
                  "השתמש"
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 border border-white" />
                    {item.priceInPearls}
                  </span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* הודעת שגיאה */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm bg-red-100 border-2 border-red-400 rounded-2xl p-3 text-center font-bold text-red-800 shadow-xl"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* פופאפ: קניה הצליחה */}
      <AnimatePresence>
        {purchasedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setPurchasedItem(null)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring" }}
              className="bg-white rounded-3xl p-6 max-w-sm shadow-2xl border-4 border-amber-400 text-center"
            >
              <div className="text-amber-700 font-black text-xl mb-2">
                🎉 קנית פריט חדש!
              </div>
              <div className="text-7xl my-3">{purchasedItem.emoji}</div>
              <div className="text-2xl font-black text-stone-800">
                {purchasedItem.name}
              </div>
              <div className="text-sm text-stone-600 my-2">
                {purchasedItem.description}
              </div>
              <BigButton
                size="md"
                variant="primary"
                onClick={() => setPurchasedItem(null)}
                icon="✨"
              >
                מעולה!
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
