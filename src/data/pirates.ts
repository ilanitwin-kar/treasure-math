import type { PirateId, PirateInfo } from "../types";

/**
 * רשימת הפיראטים שהילד יכול לבחור.
 * 6 בנים ו-6 בנות.
 */
export const PIRATES: PirateInfo[] = [
  // בנים
  { id: "captain_jack", name: "קפטן ג'ק", gender: "boy" },
  { id: "blackbeard", name: "זקן-שחור", gender: "boy" },
  { id: "scout", name: "סקאוט", gender: "boy" },
  { id: "redbeard", name: "זקן-זהב", gender: "boy" },
  { id: "lookout", name: "לוקאוט", gender: "boy" },
  { id: "navigator", name: "נווטון", gender: "boy" },

  // בנות
  { id: "pearl", name: "פנינה", gender: "girl" },
  { id: "anne", name: "אן הפיראטית", gender: "girl" },
  { id: "storm", name: "סטורם", gender: "girl" },
  { id: "ruby", name: "רובי", gender: "girl" },
  { id: "sky", name: "סקאי", gender: "girl" },
  { id: "rosie", name: "רוזי", gender: "girl" },
];

export function getPirateById(id: PirateId): PirateInfo | undefined {
  return PIRATES.find((p) => p.id === id);
}
