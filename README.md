# Content-Dashboard – Boxen · Modeln · Lifestyle

Eine einfache, mobilfreundliche Web-App, um Content-Ideen für meine Karriere als Boxer und Model zu sammeln und ihren Fortschritt zu verfolgen.

## Was die App kann

- **Übersicht:** Anzahl der Ideen gesamt, nach Status und nach Bereich, dazu ein Fortschrittsbalken („X % fertig“)
- **Drei Bereiche:** Boxen, Modeln und Lifestyle, jeweils mit eigener Farbe
- **Status:** Idee → In Bearbeitung → Fertig, direkt auf jeder Karte änderbar
- **Filter:** nach Bereich und nach Status
- **Suche:** Ideen nach Titel durchsuchen (Groß-/Kleinschreibung egal), kombinierbar mit den Filtern
- **Neue Ideen** hinzufügen und Ideen löschen
- **Speichern im Browser** (`localStorage`): keine Anmeldung, kein Server, keine Kosten
- **Zurücksetzen** auf die Beispieldaten
- **KI-Ergebnis importieren:** JSON mit `kategorie`, `hooks` (3 Texte), `caption` und `status` einfügen, prüfen lassen und Hooks/Caption mit einem Tipp kopieren. Läuft komplett im Browser, ohne externe KI oder API.

## Starten

**Variante 1 – am einfachsten:** Die Datei `index.html` per Doppelklick im Browser öffnen.

**Variante 2 – mit kleinem lokalem Server:**

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

## Wie die Dateien zusammenhängen

| Datei | Aufgabe |
|---|---|
| `index.html` | **Struktur:** Welche Bereiche gibt es auf der Seite? |
| `css/style.css` | **Aussehen:** Farben, Abstände, Layout für Handy und Desktop |
| `js/data.js` | **Beispieldaten:** die Start-Ideen |
| `js/app.js` | **Verhalten:** Anzeigen, Filtern, Ändern, Speichern |
| `js/ki-import.js` | **KI-Import:** JSON prüfen, Hooks und Caption anzeigen, Kopieren |

`index.html` lädt zuerst `data.js` (die Daten) und danach `app.js` (die Logik, die mit den Daten arbeitet).

## Hinweis

Die Daten werden nur im aktuellen Browser auf dem aktuellen Gerät gespeichert. Wenn du den Browser-Speicher löschst, erscheinen wieder die Beispieldaten.
