# Analytics-Modul

Das Analytics-Modul stellt Cognis-Administratoren datenschutzbewusste Einblicke in Kontozustand, Nutzung, Registrierungen und modul-eigene Ereignisse bereit, ohne Telemetrie an einen externen Analysedienst zu senden. Es liest Kontodaten über die Datenbank-Capability des Hosts und speichert ausschließlich Ereignisse, die an die eigene Activity-Log-API des Moduls übermittelt werden.

## Verwendungsbeispiele

Öffnen Sie den Bereich **Analytics** in der Cognis-Administration, um Kontosummen, aktivierte Konten, Aktivität der letzten sieben Tage, Inaktivität seit 30 Tagen, Rollenverteilung, Registrierungstrends, Ereignissummen und aktuelle Ereignisse zu prüfen. Wählen Sie einen Zeitraum von 7, 30 oder 90 Tagen und aktualisieren Sie die Ansicht.

Dieselben Verträge sind über die CLI verfügbar:

```sh
cognisctl analytics:metrics
cognisctl analytics:series 30
cognisctl analytics:event-summary 30
cognisctl analytics:activity-log 20
```

Zeichnen Sie ein modul-eigenes Ereignis mit optionalen JSON-Metadaten auf:

```sh
cognisctl analytics:activity-log:record report_exported '{"format":"csv"}'
```

Ein autorisierter Client kann die HTTP-API direkt verwenden:

```http
GET /api/v1/modules/analytics/metrics?days=30
GET /api/v1/modules/analytics/series?days=30
GET /api/v1/modules/analytics/type-summary?days=30
GET /api/v1/modules/analytics/activity-log?limit=20
POST /api/v1/modules/analytics/activity-log
Content-Type: application/json

{"eventType":"report_exported","meta":{"format":"csv"}}
```

Ein erfolgreiches Schreiben gibt HTTP `201` mit der erzeugten Ereignis-ID zurück. Metadaten dürfen keine Geheimnisse, Zugangsdaten, Nachrichteninhalte oder sensiblen personenbezogenen Daten enthalten.

## Technische Spezifikation

### Installation und Lebenszyklus

Installieren Sie das Modul über den Cognis Module Marketplace oder legen Sie das vollständige Repository im konfigurierten Verzeichnis für externe Module ab. Cognis validiert jede Laufzeitquelle, bevor es `bootstrap.js` lädt, das Admin-Bereich und API-Routen über `ctx` registriert. Alle API-URLs der Laufzeit bleiben unter `/api/v1/modules/analytics`, und Schriftgrößen der Oberfläche verwenden einstellungsrelative Einheiten. Damit wird der Grenzvertrag des Hosts bei Aktivierung und Aktualisierung erfüllt. Im deaktivierten Zustand lädt Cognis den dedizierten Einstiegspunkt `api/disabled.js`, der bewusst keine Routen oder Capabilities registriert, da Analytics keine Konfiguration vor der Aktivierung benötigt. Das Modul benötigt die Host-Capability `db:executor`. Das modul-eigene Ereignisschema wird beim Start sichergestellt; Fehler werden mit sicheren Komponenten- und Operationsmetadaten protokolliert.

Bei der Verteilung müssen `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, Datenbankmigration, Sprachressourcen, Dokumentation, Assets und Manifest-Hashes zusammenbleiben. Die Modul-UUID ist dauerhaft.

### Administrationsoberfläche

Der Admin-Bereich ist auf die Rolle `admin` beschränkt. Er zeigt:

- gesamte, aktivierte, kürzlich aktive, neu registrierte und inaktive Konten;
- Aktivierungsrate und nach Kontorolle gruppierte Zahlen;
- eine tägliche Registrierungsreihe für den gewählten Zeitraum;
- Gesamtzahl der Modulereignisse, eindeutige nicht leere Akteure und Zahlen je Ereignistyp; sowie
- die neuesten Modulereignisse in absteigender Reihenfolge.

UI-Texte stammen aus den deutschen, englischen, indonesischen und japanischen XML-Ressourcen des Moduls. Zeitstempel verwenden, sofern vorhanden, den Host-Formatierer und andernfalls `Intl.DateTimeFormat` des Browsers.

### HTTP-API

Alle Routen erfordern die Rolle `admin`.

- `GET /api/v1/modules/analytics/metrics?days=<n>` liefert Kontozustandsmetriken. `days` ist standardmäßig `30`, muss positiv sein und ist auf `365` begrenzt.
- `GET /api/v1/modules/analytics/series?days=<n>` liefert je UTC-Datum im Zeitraum einen Punkt `{ date, count }` und verwendet dieselben `days`-Regeln.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` liefert `{ total, uniqueActors, byType }`. Der Pfad `event-summary` ist eine gleichwertige Kompatibilitätsroute; die Browser-UI nutzt `type-summary`, um Datenschutzfilter für URLs mit `event` zu vermeiden.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>` liefert aktuelle Ereignisse ohne gespeicherte Metadaten. `limit` ist standardmäßig `50`, muss positiv sein und ist auf `200` begrenzt.
- `POST /api/v1/modules/analytics/activity-log` akzeptiert `{ eventType, meta }`. Der UTF-8-JSON-Body ist auf 16 KiB begrenzt, `eventType` wird bereinigt und auf 64 Zeichen begrenzt, und `meta` wird nur als Objekt gespeichert, das kein Array ist.

### Antworten und Fehler

Erfolgreiche Lesezugriffe liefern HTTP `200` mit `data`. Ist der Ereignisspeicher nicht verfügbar, liefern Ereigniszusammenfassung und Activity-Log sichere leere Ergebnisse; Metriken und Serie liefern `503`. Ungültiges JSON oder ein fehlender Ereignistyp liefert `400`, ein zu großer Body `413` und ein Schreibzugriff ohne Speicher `503`. Abfrage- und Schreibfehler liefern generische sichere Meldungen ohne interne Details. Abfrage- und Schemafehler werden über den Host-Logger protokolliert.

### Persistenz und Datenschutz

Kontometriken lesen die Host-Tabelle `accounts` über `db:executor`; Kontodatensätze werden nicht kopiert. Eigene Ereignisse liegen in `sample_analytics_events` mit ID, Ereignistyp, optionaler Konto-ID, serialisierten Metadaten und Erstellungszeit. Über die aktuelle API erzeugte Ereignisse verwenden eine leere Konto-ID. Antworten mit aktuellen Ereignissen lassen Metadaten aus; Zusammenfassungen aggregieren Ereignistypen und nicht leere Akteure.

Das Modul kontaktiert keinen externen Analyseanbieter. Betreiber sind für geeignete Ereignisnamen, minimale Metadaten, Aufbewahrungsregeln für die Modultabelle und beschränkten administrativen Zugriff verantwortlich.

### CLI-Verträge

`analytics:metrics`, `analytics:series [days]`, `analytics:event-summary [days]` und `analytics:activity-log [limit]` rufen die entsprechenden authentifizierten Modulrouten auf. `analytics:activity-log:record <event-type> [meta-json]` verarbeitet optionale Metadaten vor dem POST als JSON. Ungültiges JSON und fehlende Pflichtargumente meldet die CLI.

### Betriebsprüfung

Führen Sie nach jeder Änderung an einer paketierten Datei aus:

```sh
npm install
npm test
npm run lint
npm run manifest:hashes
npm run check:manifest
git diff --check
```

`npm run manifest:hashes` erstellt `manifest.files` mit SHA-256-Hashes neu und formatiert das Manifest mit der Prettier-Konfiguration des Repositorys. `npm run check:manifest` prüft Versionen, Einstiegspunkte, Routen, Paketpfade und Datei-Hashes.

Wenn Cognis das Modul deinstalliert, entfernt die Auswahl zur Inhaltslöschung alle moduleigenen Analyseereignisse. Ohne ausgewählte Inhaltslöschung bleiben diese Ereignisse erhalten. Die Bereinigungsaktion wird ohne Ereignisnutzdaten über den Host-Logger protokolliert.
