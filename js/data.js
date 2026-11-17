// ============================================================
// Beispieldaten
// ------------------------------------------------------------
// Eine Liste (Array) von Content-Ideen. Jede Idee ist ein
// Objekt mit festen Eigenschaften:
//   id        – eindeutige Nummer
//   titel     – kurzer Name der Idee
//   bereich   – "Boxen", "Modeln" oder "Lifestyle"
//   status    – "Idee", "In Bearbeitung" oder "Fertig"
//   plattform – z. B. "Instagram", "TikTok", "YouTube"
//   notiz     – kurze Beschreibung
//   datum     – Erstellungsdatum im Format JJJJ-MM-TT
// ============================================================

const BEISPIEL_IDEEN = [
  // --- Boxen ---
  {
    id: 1,
    titel: "Sparring-Highlights Reel",
    bereich: "Boxen",
    status: "Fertig",
    plattform: "Instagram",
    notiz: "Die besten Kombinationen aus dem Sparring der Woche, schnell geschnitten mit Musik.",
    datum: "2026-11-02"
  },
  {
    id: 2,
    titel: "Ein Tag im Trainingslager",
    bereich: "Boxen",
    status: "In Bearbeitung",
    plattform: "YouTube",
    notiz: "Vlog vom Aufstehen bis zum Abendtraining. Rohmaterial ist gedreht, Schnitt fehlt noch.",
    datum: "2026-11-08"
  },
  {
    id: 3,
    titel: "3 Fehler beim Jab",
    bereich: "Boxen",
    status: "Idee",
    plattform: "TikTok",
    notiz: "Kurzes Erklärvideo für Anfänger. Mit Trainer zusammen drehen.",
    datum: "2026-11-12"
  },

  // --- Modeln ---
  {
    id: 4,
    titel: "Behind the Scenes Fotoshooting",
    bereich: "Modeln",
    status: "Fertig",
    plattform: "Instagram",
    notiz: "Story-Serie vom Shooting: Make-up, Set, Ergebnis.",
    datum: "2026-10-28"
  },
  {
    id: 5,
    titel: "Vom Ring auf den Laufsteg",
    bereich: "Modeln",
    status: "Idee",
    plattform: "TikTok",
    notiz: "Transition-Video: Boxhandschuhe aus, Outfit an.",
    datum: "2026-11-10"
  },
  {
    id: 6,
    titel: "Posing-Tipps für Sportler",
    bereich: "Modeln",
    status: "In Bearbeitung",
    plattform: "Instagram",
    notiz: "Karussell-Post mit 5 Tipps und Beispielfotos.",
    datum: "2026-11-14"
  },

  // --- Lifestyle ---
  {
    id: 7,
    titel: "Mein Meal-Prep vor dem Kampf",
    bereich: "Lifestyle",
    status: "In Bearbeitung",
    plattform: "YouTube",
    notiz: "Wochenplan zeigen, Einkauf und Kochen filmen.",
    datum: "2026-11-05"
  },
  {
    id: 8,
    titel: "Morgenroutine",
    bereich: "Lifestyle",
    status: "Idee",
    plattform: "TikTok",
    notiz: "Laufen, Frühstück, Mobility – in 30 Sekunden.",
    datum: "2026-11-15"
  },
  {
    id: 9,
    titel: "Regeneration & Schlaf",
    bereich: "Lifestyle",
    status: "Idee",
    plattform: "Instagram",
    notiz: "Was ich nach hartem Training für die Erholung mache.",
    datum: "2026-11-16"
  }
];
