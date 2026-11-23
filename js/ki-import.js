// ============================================================
// KI-Ergebnis importieren
// ------------------------------------------------------------
// Liest JSON-Text ein (z. B. die Antwort einer KI), prüft die
// Struktur und zeigt Hooks und Caption mit Kopieren-Buttons an.
//
// Erwartetes Format:
//   {
//     "kategorie": "Boxen",
//     "hooks": ["Hook 1", "Hook 2", "Hook 3"],
//     "caption": "Text für den Beitrag",
//     "status": "Idee"
//   }
//
// Wichtig: Diese Datei ist unabhängig von app.js. Sie ändert
// keine Content-Ideen und speichert nichts im Browser.
// Es wird keine KI und kein Internetdienst aufgerufen –
// der Text wird nur hier im Browser verarbeitet.
// ============================================================

// Lokale Beispieldaten zum Ausprobieren
const KI_BEISPIEL = {
  kategorie: "Boxen",
  hooks: [
    "Ich habe 30 Tage jeden Morgen geboxt – das ist passiert.",
    "Der Fehler, den 90 % der Anfänger beim Jab machen.",
    "Vom Ring auf den Laufsteg: So sieht meine Woche wirklich aus."
  ],
  caption: "Disziplin schlägt Talent. 🥊 Jeden Tag ein bisschen besser – im Ring und vor der Kamera. Was ist dein Ziel für diese Woche? #boxen #training #mindset",
  status: "Idee"
};


// ---------- Einlesen & Prüfen ----------

// Gibt entweder { daten } oder { fehler: [Liste von Meldungen] } zurück.
// Wirft nie einen Fehler – die App kann dadurch nicht abstürzen.
function pruefeKiJson(text) {
  let bereinigt = text.trim();

  if (bereinigt === "") {
    return { fehler: ["Das Feld ist leer. Bitte füge zuerst den JSON-Text ein."] };
  }

  // KIs packen JSON oft in einen Code-Block (```json … ```). Den entfernen wir.
  const codeBlock = bereinigt.match(/^```[a-zA-Z]*\s*([\s\S]*?)\s*```$/);
  if (codeBlock) {
    bereinigt = codeBlock[1];
  }

  // 1) Ist es überhaupt gültiges JSON?
  let daten;
  try {
    daten = JSON.parse(bereinigt);
  } catch (e) {
    return {
      fehler: [
        "Das ist kein gültiges JSON. Häufige Ursachen: fehlende Anführungszeichen \" \", " +
        "ein Komma zu viel am Ende, oder der Text wurde nicht vollständig kopiert."
      ]
    };
  }

  // 2) Ist es ein Objekt { … } (und keine Liste, Zahl oder Text)?
  if (daten === null || typeof daten !== "object" || Array.isArray(daten)) {
    return { fehler: ["Das JSON muss ein Objekt in geschweiften Klammern { … } sein."] };
  }

  // 3) Sind alle Felder vorhanden und haben den richtigen Typ?
  const fehler = [];
  const istText = (wert) => typeof wert === "string" && wert.trim() !== "";

  for (const feld of ["kategorie", "caption", "status"]) {
    if (!(feld in daten)) {
      fehler.push("Das Feld „" + feld + "“ fehlt.");
    } else if (!istText(daten[feld])) {
      fehler.push("„" + feld + "“ muss ein nicht leerer Text sein.");
    }
  }

  if (!("hooks" in daten)) {
    fehler.push("Das Feld „hooks“ fehlt.");
  } else if (!Array.isArray(daten.hooks)) {
    fehler.push("„hooks“ muss eine Liste sein, z. B. [\"Hook 1\", \"Hook 2\", \"Hook 3\"].");
  } else if (daten.hooks.length !== 3) {
    fehler.push("„hooks“ muss genau 3 Einträge haben (gefunden: " + daten.hooks.length + ").");
  } else {
    daten.hooks.forEach((hook, i) => {
      if (!istText(hook)) {
        fehler.push("Hook " + (i + 1) + " muss ein nicht leerer Text sein.");
      }
    });
  }

  if (fehler.length > 0) {
    return { fehler };
  }

  // Nur die erwarteten Felder übernehmen, Leerzeichen am Rand entfernen
  return {
    daten: {
      kategorie: daten.kategorie.trim(),
      hooks: daten.hooks.map((h) => h.trim()),
      caption: daten.caption.trim(),
      status: daten.status.trim()
    }
  };
}


// ---------- Kopieren ----------

async function kopiereText(text) {
  // Moderner Weg (funktioniert auf https-Seiten wie GitHub Pages)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // weiter mit dem Ersatzweg unten
    }
  }
  // Ersatzweg für ältere Browser
  const hilfsfeld = document.createElement("textarea");
  hilfsfeld.value = text;
  hilfsfeld.setAttribute("readonly", "");
  hilfsfeld.style.position = "fixed";
  hilfsfeld.style.opacity = "0";
  document.body.append(hilfsfeld);
  hilfsfeld.select();
  let erfolgreich = false;
  try {
    erfolgreich = document.execCommand("copy");
  } catch (e) {
    erfolgreich = false;
  }
  hilfsfeld.remove();
  return erfolgreich;
}

function erzeugeKopierKnopf(text, beschriftung) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "knopf knopf-kopieren";
  knopf.textContent = "Kopieren";
  knopf.setAttribute("aria-label", beschriftung + " kopieren");

  knopf.addEventListener("click", async () => {
    const ok = await kopiereText(text);
    knopf.textContent = ok ? "Kopiert ✓" : "Bitte manuell markieren";
    knopf.classList.toggle("kopiert", ok);
    setTimeout(() => {
      knopf.textContent = "Kopieren";
      knopf.classList.remove("kopiert");
    }, 2000);
  });

  return knopf;
}


// ---------- Anzeigen ----------

// Hilfsfunktion: Element mit Klasse und Text (textContent = sicher, kein HTML)
function kiElement(tag, klasse, text) {
  const element = document.createElement(tag);
  if (klasse) element.className = klasse;
  if (text !== undefined) element.textContent = text;
  return element;
}

function zeigeKiErgebnis(daten) {
  const ergebnis = document.getElementById("ki-ergebnis");
  ergebnis.innerHTML = "";

  // Kopfzeile: Kategorie und Status
  const kopf = kiElement("div", "ki-kopf");
  kopf.append(kiElement("span", "ki-etikett", "Kategorie: " + daten.kategorie));
  kopf.append(kiElement("span", "ki-etikett", "Status: " + daten.status));
  ergebnis.append(kopf);

  // Drei Hook-Karten
  const liste = kiElement("div", "ki-liste");
  daten.hooks.forEach((hook, i) => {
    const karte = kiElement("article", "ki-karte");
    karte.append(kiElement("span", "ki-karte-titel", "Hook " + (i + 1)));
    karte.append(kiElement("p", "ki-text", hook));
    karte.append(erzeugeKopierKnopf(hook, "Hook " + (i + 1)));
    liste.append(karte);
  });
  ergebnis.append(liste);

  // Caption-Karte
  const caption = kiElement("article", "ki-karte ki-caption");
  caption.append(kiElement("span", "ki-karte-titel", "Caption"));
  caption.append(kiElement("p", "ki-text", daten.caption));
  caption.append(erzeugeKopierKnopf(daten.caption, "Caption"));
  ergebnis.append(caption);

  ergebnis.hidden = false;
}

function zeigeKiFehler(meldungen) {
  const box = document.getElementById("ki-fehler");
  box.innerHTML = "";
  box.append(kiElement("strong", null, "Import nicht möglich:"));
  const liste = kiElement("ul");
  for (const meldung of meldungen) {
    liste.append(kiElement("li", null, meldung));
  }
  box.append(liste);
  box.hidden = false;

  // Altes Ergebnis ausblenden, damit nichts Falsches angezeigt wird
  document.getElementById("ki-ergebnis").hidden = true;
}

function importiereKiErgebnis() {
  const text = document.getElementById("ki-eingabe").value;
  const pruefung = pruefeKiJson(text);

  if (pruefung.fehler) {
    zeigeKiFehler(pruefung.fehler);
    return;
  }

  document.getElementById("ki-fehler").hidden = true;
  zeigeKiErgebnis(pruefung.daten);
}


// ---------- Ereignisse verbinden ----------

document.getElementById("ki-importieren").addEventListener("click", importiereKiErgebnis);

document.getElementById("ki-beispiel").addEventListener("click", () => {
  document.getElementById("ki-eingabe").value = JSON.stringify(KI_BEISPIEL, null, 2);
  importiereKiErgebnis();
});

document.getElementById("ki-leeren").addEventListener("click", () => {
  document.getElementById("ki-eingabe").value = "";
  document.getElementById("ki-fehler").hidden = true;
  document.getElementById("ki-ergebnis").hidden = true;
});
