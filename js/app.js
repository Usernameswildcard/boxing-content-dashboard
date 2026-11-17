// ============================================================
// App-Logik
// ------------------------------------------------------------
// Ablauf:
//   1. Ideen laden (aus dem Browser-Speicher oder Beispieldaten)
//   2. Übersicht und Liste anzeigen
//   3. Auf Klicks und Eingaben reagieren
//   4. Nach jeder Änderung speichern und neu anzeigen
// ============================================================

// Name, unter dem wir die Daten im Browser speichern
const SPEICHER_SCHLUESSEL = "content-dashboard-ideen";

const BEREICHE = ["Boxen", "Modeln", "Lifestyle"];
const STATUS_WERTE = ["Idee", "In Bearbeitung", "Fertig"];

// Aktuelle Filter-Auswahl
let filterBereich = "Alle";
let filterStatus = "Alle";

// Die Ideen, mit denen die App gerade arbeitet
let ideen = ladeIdeen();


// ---------- Speichern & Laden ----------

function ladeIdeen() {
  const gespeichert = localStorage.getItem(SPEICHER_SCHLUESSEL);
  if (gespeichert) {
    try {
      return JSON.parse(gespeichert);
    } catch (fehler) {
      // Falls die gespeicherten Daten kaputt sind, nehmen wir die Beispieldaten
      console.warn("Gespeicherte Daten konnten nicht gelesen werden.", fehler);
    }
  }
  // Kopie der Beispieldaten, damit das Original unverändert bleibt
  return structuredClone(BEISPIEL_IDEEN);
}

function speichereIdeen() {
  localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(ideen));
}


// ---------- Hilfsfunktionen ----------

// Wandelt z. B. "In Bearbeitung" in "in-bearbeitung" um (für CSS-Klassen)
function alsKlasse(text) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

// Wandelt "2026-11-17" in "17.11.2026" um
function formatiereDatum(isoDatum) {
  const [jahr, monat, tag] = isoDatum.split("-");
  return `${tag}.${monat}.${jahr}`;
}

// Erzeugt ein HTML-Element mit Klasse und Text.
// Wir nutzen textContent statt innerHTML, damit eingegebener Text
// niemals als Code ausgeführt wird (Sicherheit).
function erzeuge(tag, klasse, text) {
  const element = document.createElement(tag);
  if (klasse) element.className = klasse;
  if (text !== undefined) element.textContent = text;
  return element;
}


// ---------- Übersicht ----------

function zeigeUebersicht() {
  const kacheln = document.getElementById("kacheln");
  kacheln.innerHTML = "";

  const gesamt = ideen.length;
  const zaehle = (feld, wert) => ideen.filter((idee) => idee[feld] === wert).length;

  // Eine Kachel pro Kennzahl
  const eintraege = [
    { name: "Gesamt", zahl: gesamt, klasse: "gesamt" },
    ...STATUS_WERTE.map((s) => ({ name: s, zahl: zaehle("status", s), klasse: "status-" + alsKlasse(s) })),
    ...BEREICHE.map((b) => ({ name: b, zahl: zaehle("bereich", b), klasse: "bereich-" + alsKlasse(b) }))
  ];

  for (const eintrag of eintraege) {
    const kachel = erzeuge("div", "kachel " + eintrag.klasse);
    kachel.append(erzeuge("span", "kachel-zahl", eintrag.zahl));
    kachel.append(erzeuge("span", "kachel-name", eintrag.name));
    kacheln.append(kachel);
  }

  // Fortschrittsbalken: Anteil der fertigen Ideen
  const prozent = gesamt === 0 ? 0 : Math.round((zaehle("status", "Fertig") / gesamt) * 100);
  document.getElementById("fortschritt-prozent").textContent = prozent + " % fertig";
  document.getElementById("fortschritt-fuellung").style.width = prozent + "%";
}


// ---------- Ideen-Liste ----------

function erzeugeKarte(idee) {
  const karte = erzeuge("article", "karte bereich-" + alsKlasse(idee.bereich));

  // Kopf der Karte: Bereich + Status-Badge
  const kopf = erzeuge("div", "karte-kopf");
  kopf.append(erzeuge("span", "bereich-etikett", idee.bereich));
  kopf.append(erzeuge("span", "status-badge status-" + alsKlasse(idee.status), idee.status));
  karte.append(kopf);

  karte.append(erzeuge("h3", "karte-titel", idee.titel));
  if (idee.notiz) {
    karte.append(erzeuge("p", "karte-notiz", idee.notiz));
  }
  karte.append(erzeuge("p", "karte-meta", idee.plattform + " · " + formatiereDatum(idee.datum)));

  // Fuß der Karte: Status ändern + Löschen
  const fuss = erzeuge("div", "karte-fuss");

  const statusAuswahl = document.createElement("select");
  statusAuswahl.setAttribute("aria-label", "Status von „" + idee.titel + "“ ändern");
  for (const s of STATUS_WERTE) {
    const option = erzeuge("option", null, s);
    option.value = s;
    option.selected = s === idee.status;
    statusAuswahl.append(option);
  }
  statusAuswahl.addEventListener("change", () => aendereStatus(idee.id, statusAuswahl.value));
  fuss.append(statusAuswahl);

  const loeschKnopf = erzeuge("button", "knopf knopf-loeschen", "Löschen");
  loeschKnopf.type = "button";
  loeschKnopf.addEventListener("click", () => loescheIdee(idee.id));
  fuss.append(loeschKnopf);

  karte.append(fuss);
  return karte;
}

function zeigeListe() {
  const liste = document.getElementById("ideen-liste");
  liste.innerHTML = "";

  // Nur Ideen behalten, die zu beiden Filtern passen
  const sichtbar = ideen.filter((idee) =>
    (filterBereich === "Alle" || idee.bereich === filterBereich) &&
    (filterStatus === "Alle" || idee.status === filterStatus)
  );

  // Neueste Ideen zuerst
  sichtbar.sort((a, b) => b.datum.localeCompare(a.datum));

  for (const idee of sichtbar) {
    liste.append(erzeugeKarte(idee));
  }

  document.getElementById("anzahl-sichtbar").textContent = "(" + sichtbar.length + ")";
  document.getElementById("leer-hinweis").hidden = sichtbar.length > 0;
}

// Alles neu anzeigen
function aktualisiere() {
  zeigeUebersicht();
  zeigeListe();
}


// ---------- Aktionen ----------

function aendereStatus(id, neuerStatus) {
  const idee = ideen.find((i) => i.id === id);
  if (!idee) return;
  idee.status = neuerStatus;
  speichereIdeen();
  aktualisiere();
}

function loescheIdee(id) {
  const idee = ideen.find((i) => i.id === id);
  if (!idee) return;
  if (!confirm("„" + idee.titel + "“ wirklich löschen?")) return;
  ideen = ideen.filter((i) => i.id !== id);
  speichereIdeen();
  aktualisiere();
}

function fuegeIdeeHinzu(ereignis) {
  // Verhindert, dass der Browser die Seite neu lädt
  ereignis.preventDefault();

  const titelFeld = document.getElementById("eingabe-titel");
  const titel = titelFeld.value.trim();
  const fehler = document.getElementById("fehler-titel");

  // Einfache Prüfung: Titel darf nicht leer sein
  if (titel === "") {
    fehler.hidden = false;
    titelFeld.focus();
    return;
  }
  fehler.hidden = true;

  // Neue, eindeutige ID: höchste vorhandene ID + 1
  const neueId = ideen.reduce((max, i) => Math.max(max, i.id), 0) + 1;

  ideen.push({
    id: neueId,
    titel: titel,
    bereich: document.getElementById("eingabe-bereich").value,
    status: "Idee",
    plattform: document.getElementById("eingabe-plattform").value,
    notiz: document.getElementById("eingabe-notiz").value.trim(),
    datum: new Date().toISOString().slice(0, 10)
  });

  speichereIdeen();
  ereignis.target.reset();
  aktualisiere();
}

function setzeZurueck() {
  if (!confirm("Alle Änderungen verwerfen und Beispieldaten wiederherstellen?")) return;
  ideen = structuredClone(BEISPIEL_IDEEN);
  speichereIdeen();
  aktualisiere();
}


// ---------- Ereignisse verbinden ----------

// Bereichs-Filter (Buttons)
document.querySelectorAll("#filter-bereich .filter-knopf").forEach((knopf) => {
  knopf.addEventListener("click", () => {
    filterBereich = knopf.dataset.wert;
    // Aktiven Button hervorheben
    document.querySelectorAll("#filter-bereich .filter-knopf").forEach((k) => {
      k.classList.toggle("aktiv", k === knopf);
      k.setAttribute("aria-pressed", k === knopf);
    });
    zeigeListe();
  });
});

// Status-Filter (Auswahlfeld)
document.getElementById("filter-status").addEventListener("change", (ereignis) => {
  filterStatus = ereignis.target.value;
  zeigeListe();
});

document.getElementById("formular").addEventListener("submit", fuegeIdeeHinzu);
document.getElementById("knopf-zuruecksetzen").addEventListener("click", setzeZurueck);

// Start!
aktualisiere();
