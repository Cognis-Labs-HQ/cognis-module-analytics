# Technische Referenz

Öffentliche Schnittstellen, Konfiguration und Lebenszyklus von Analysen.

## Schnittstellen

Das Analytics-Modul stellt Cognis-Administratoren datenschutzbewusste Einblicke in Kontozustand, Nutzung, Registrierungen und modul-eigene Ereignisse bereit, ohne Telemetrie an einen externen Analysedienst zu senden. Es liest Kontodaten über die öffentliche Capability `auth:accountStore` und speichert ausschließlich Ereignisse, die an die eigene Activity-Log-API des Moduls übermittelt werden.

### HTTP-API

Alle Routen erfordern die Rolle `admin`.

- `GET /api/v1/modules/analytics/metrics?days=<n>`: Der Standardzeitraum beträgt 30 Tage. Zulässig sind ganze Zahlen von 1 bis 365; ungültige Werte liefern 400 statt einer stillen Begrenzung.
- `GET /api/v1/modules/analytics/series?days=<n>` liefert je UTC-Datum im Zeitraum einen Punkt `{ date, count }` und verwendet dieselben `days`-Regeln.
- `GET /api/v1/modules/analytics/type-summary?days=<n>` liefert `{ total, uniqueActors, byType }`. Der Pfad `event-summary` ist eine gleichwertige Kompatibilitätsroute; die Browser-UI nutzt `type-summary`, um Datenschutzfilter für URLs mit `event` zu vermeiden.
- `GET /api/v1/modules/analytics/activity-log?limit=<n>`: Ohne Limit werden alle passenden Ereignisse geliefert. Ein angegebenes Limit muss eine positive sichere Ganzzahl sein und wird exakt angewendet; ungültige Werte liefern 400.
- `POST /api/v1/modules/analytics/activity-log` akzeptiert `{ eventType, meta }`. Der UTF-8-JSON-Body ist auf 16 KiB begrenzt, `eventType` wird bereinigt und auf 64 Zeichen begrenzt, und `meta` wird nur als Objekt gespeichert, das kein Array ist.

## Konfiguration

Analytics deklariert kein Modulpräferenzformular. Berichtszeiträume und ausdrückliche Listenlimits sind Anfragewerte, keine gespeicherten Einstellungen. Kontometriken verwenden `auth:accountStore`, eigene Ereignisse `db:executor`.

### Installation und Lebenszyklus

Installieren Sie das Modul über den Cognis Module Marketplace oder legen Sie das vollständige Repository im konfigurierten Verzeichnis für externe Module ab. Das Manifest deklariert `bootstrap.js` als einzigen Einstiegspunkt für das aktivierte Modul. Cognis validiert jede Laufzeitquelle vor dem Laden; anschließend registriert `bootstrapModule(ctx)` den Admin-Bereich und die API-Routen über den bereichsgebundenen Hostkontext. Alle API-URLs der Laufzeit bleiben unter `/api/v1/modules/analytics`, und Schriftgrößen der Oberfläche verwenden einstellungsrelative Einheiten. Damit wird der Grenzvertrag des Hosts bei Aktivierung und Aktualisierung erfüllt. Analytics benötigt keine Konfiguration vor der Aktivierung; deaktivierte Module stellen keine Laufzeit-API oder Oberfläche bereit und führen den Aktivierungs-Bootstrap nicht aus. Das Modul benötigt die Host-Capabilities `db:executor` und `auth:accountStore`. Das modul-eigene Ereignisschema wird beim Start sichergestellt; Fehler werden mit sicheren Komponenten- und Operationsmetadaten protokolliert.

Bei der Verteilung müssen `manifest.json`, `package.json`, `package-lock.json`, `routes.json`, `bootstrap.js`, API, CLI, UI, Datenbankmigration, Sprachressourcen, Dokumentation, Assets und Manifest-Hashes zusammenbleiben. Die Modul-UUID ist dauerhaft.

Die Marketplace-Grafiken verwenden die in `manifest.json` unter `assets.icon` und `assets.banner` deklarierten Dateien; beide Dateien sind im verifizierten Paketbestand enthalten. Das Banner hält das vollständige Logo, den Titel und das Diagramm in einem mittigen sicheren Bereich für Cognis’ höhenbegrenzte Darstellung. Das quadratische PNG-Icon ist ein Ausschnitt des Diagramms im Banner.

## Verhalten

Berichtsbereiche verwenden den Host-Composer-Hook `data-composer-layout="compact"` für schmale Inhalte. Kompakte Ereignisübersichten zeigen jeden Balken unter Bezeichnung und Anzahl; Summen und Filter brechen um. Ereignistabellen behalten feste Spaltenanteile bei und erlauben in kompakten Ansichten den Umbruch von Zeitstempeln. Die Regeln gelten für moduleigene Berichtsinhalte und berücksichtigen die Theme- und Textgrößeneinstellungen des Hosts.

### Administrationsoberfläche

Der Admin-Bereich ist auf die Rolle `admin` beschränkt. Er zeigt:

- gesamte, aktivierte, kürzlich aktive, neu registrierte und inaktive Konten;
- Aktivierungsrate und nach Kontorolle gruppierte Zahlen;
- eine tägliche Registrierungsreihe für den gewählten Zeitraum;
- Gesamtzahl der Modulereignisse, eindeutige nicht leere Akteure und Zahlen je Ereignistyp; sowie
- die neuesten Modulereignisse in absteigender Reihenfolge.

UI-Texte stammen aus den deutschen, englischen, indonesischen und japanischen XML-Ressourcen des Moduls. Zeitstempel verwenden, sofern vorhanden, den Host-Formatierer und andernfalls `Intl.DateTimeFormat` des Browsers.

### Antworten und Fehler

Erfolgreiche Lesezugriffe liefern HTTP `200` mit `data`. Ist der Ereignisspeicher nicht verfügbar, liefern Ereigniszusammenfassung und Activity-Log sichere leere Ergebnisse; Metriken und Serie liefern `503`. Ungültiges JSON oder ein fehlender Ereignistyp liefert `400`, ein zu großer Body `413` und ein Schreibzugriff ohne Speicher `503`. Abfrage- und Schreibfehler liefern generische sichere Meldungen ohne interne Details. Abfrage- und Schemafehler werden über den Host-Logger protokolliert.

### CLI-Verträge

`modules:analytics:metrics`, `modules:analytics:series [days]`, `modules:analytics:eventSummary [days]` und `modules:analytics:activityLog [limit]` rufen die entsprechenden authentifizierten Modulrouten auf. `modules:analytics:activityLog:record <event-type> [meta-json]` verarbeitet optionale Metadaten vor dem POST als JSON. Ungültiges JSON und fehlende Pflichtargumente meldet die CLI.

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

### Eigene Aktionsabläufe

Kontometriken und Registrierungsserien verwenden `auth:accountStore.list()` und `getInfo()`; sie fragen niemals Tabellen anderer Komponenten ab. Nur moduleigene Ereignisse verwenden `db:executor`.

HTTP-Operationen laufen über moduleigene ctx-Abläufe mit Validierung, Ausführung und Darstellung. Tests führen diese Stufen aus und verhindern Persistenz bei fehlgeschlagener Validierung oder Schemainitialisierung.

### Mitwirkendenstruktur und Zuständigkeit des Hosts

Neue Module beginnen mit [cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template); dieses Repository folgt der in `AGENTS.md` festgehaltenen Vorlagenrevision. `bootstrap.js` orchestriert den Lebenszyklus, `api/index.js` verdrahtet ctx-Abhängigkeiten, `api/routes/<domain>/index.js` enthält HTTP-Handler und `api/reuse/` wiederverwendbaren Servercode. Browserfunktionen liegen unter `ui/`, Styles unter `ui/styles/`, wiederverwendbare Vorlagen unter `ui/templates/` und lokalisierte Dokumentation unter `docs/TECHNICAL.<locale>.md`. Historische Veröffentlichungen liegen in `docs/changelog/` und werden nicht gehasht. Nicht unterstützte optionale Bereiche entfallen.

Öffentliche ctx-Fähigkeiten und deklarierte Abläufe nutzen; niemals Cognis-Interna oder benachbarte Module importieren. Dashboard-Anbieter für Fähigkeiten und Navigation exportieren `mountProvider(scopedUiCtx)` und geben Aufräumfunktionen für eigene Ressourcen zurück. Importe registrieren kein Modulverhalten. Der Host entfernt Fähigkeiten, Ablauf-Hooks, Listener und Anbieterzustand beim Deaktivieren und bindet zwischengespeicherte Anbieter beim erneuten Aktivieren neu ein. Einstellungen, Administration und Anmeldefußzeilen folgen ihren jeweiligen dokumentierten Host-Verträgen. Diese Verträge mit eigenständigen Testdoubles prüfen, die ausführbare Strukturprüfung ausführen, Hashes nach der letzten Paketänderung erneuern und vor der Veröffentlichung Lint, Tests und Manifestprüfung ausführen.

### Übertragung und Zustimmung

Analytics erfasst authentifizierte Aktivitäten über `POST /api/v1/modules/analytics/activity` und den Browserablauf `analytics:recordActivity`. Kontogebundene Idempotenzschlüssel verhindern Duplikate; ursprüngliche Zeiten bleiben erhalten. Navigation und vorgemerkte Study-Aktionen liefern nur sichere skalare Metadaten (`component`, `action`, `result`, `count`, `durationMs`); andere Daten werden vor dem Speichern abgelehnt. Berichte verwenden Konto-Hashes. Deaktivieren entfernt Handler und Listener.

Der Host stellt `offline:outbox`, `offline:state` und `offline:accessPolicy` über ctx bereit. Komponenten registrieren Übertragungshandler für ihre Anbieter-Lebensdauer und stabile IDs über `offline:enqueue`; `offline:flush` autorisiert und überträgt. Die dauerhafte kontogebundene Warteschlange umfasst höchstens 1.000 Einträge und 1 MB für sieben Tage, ohne Tokens. IDs und Zeitstempel bleiben erhalten; temporäre Fehler werden wiederholt, bestätigte oder dauerhaft abgelehnte Einträge entfernt. Eine lokalisierte Warnung meldet Ablehnungen. Abmelden leert die Konto-Warteschlange; andere Konten erhalten keine fremden Einträge. Deaktivieren stoppt neue Offline-Einträge. Vorhandene Einträge können online übertragen werden.

### Hintergrunddaten und Warnungen

Analytics registriert seinen Übertragungsanbieter mit `protectOnClose: false` in der Host-Warteschlange. Navigations- und Aktivitätsdaten bleiben dauerhaft gespeichert und werden nach autorisierter Wiederherstellung, auch durch die manuelle Verbindungsprüfung, übertragen. Sie lösen keine Schließwarnung des Browsers mehr aus. Benutzeränderungen behalten den Standardschutz des Hosts. Dies erfordert den aktualisierten Klassifizierungsvertrag des Hosts.

### Kontobezogene Bereinigung

Der lebenszyklusgebundene Hook `analytics:deleteAccountActivity` erweitert `deprovision-user` in `cleanup-dependencies`. Nach einer gespeicherten Kontolöschung wartet er auf die Schemainitialisierung und löscht nur Ereignisse mit dem passenden Kontohash. Dafür verwendet er dieselbe SHA-256-Ableitung wie die authentifizierte Erfassung. Andere Konten und anonyme Administratorereignisse bleiben erhalten. Deaktivierung, Archivierung und abgelehnte Löschanfragen behalten die Aktivitäten bei. Fehler werden protokolliert und weitergegeben; der Host entfernt den Hook beim Beenden des Modulkontexts vor einer erneuten Aktivierung.

### Geführtes Tutorial

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

Der gemeinsame Host stellt schwebende Aktionen über seine Warteschlange bereit. Erstbesuche bieten Weiter/Fertig ohne Abbrechen oder Überspringen; Wiederholungen bieten Überspringen vor dem letzten sichtbaren Schritt. Neustart erscheint nach dem ersten sichtbaren Schritt. Abschlüsse bleiben nach Inhaltsänderungen gültig. Ausdrückliche highlightNext-Angaben aktivieren nur die Atemanimation für Erklärungen; reduzierte Bewegung deaktiviert sie. Jeder Schritt hebt ein anderes reales Bedienelement in UI-Reihenfolge hervor. Anleitungen bleiben an die aktuelle Ansicht gebunden, behandeln leere und optionale Zustände und räumen bei Navigation oder Besitzerentfernung auf.

### Vor dem Lesen des Diagramms aktualisieren

Die Übung zum Berichtszeitraum umfasst die Auswahl eines Zeitraums und das Klicken auf Aktualisieren. Sie wird erst fortgesetzt, wenn alle Berichtsabfragen und das Einlesen der Antworten erfolgreich abgeschlossen sind und der Bericht angezeigt wird. Allein das Ändern der Auswahl, eine fehlgeschlagene Anfrage oder das Schließen des Abschnitts setzt die Übung nicht fort. Nach Fehlern stehen die Bedienelemente für einen erneuten Versuch bereit; während der Aktualisierung sind Zeitraum und Aktualisieren vorübergehend deaktiviert.

## Sicherheit

Aggregierte Berichte benötigen Administratorrechte. Authentifizierte Aktivität erhält ihre Identität aus geprüften Claims und akzeptiert nur begrenzte sichere Metadaten. Berichte verwenden Kontodigests statt roher Kennungen. Aufbewahrung und Löschung betreffen nur eigene Ereignisse und bewahren fremde Konto- und Anwendungsdaten.

### Persistenz und Datenschutz

Kontometriken nutzen die öffentliche Capability `auth:accountStore`; Kontodatensätze werden nicht kopiert. Eigene Ereignisse liegen in `sample_analytics_events` mit ID, Ereignistyp, optionaler Konto-ID, serialisierten Metadaten und Erstellungszeit. Über die aktuelle API erzeugte Ereignisse verwenden eine leere Konto-ID. Antworten mit aktuellen Ereignissen lassen Metadaten aus; Zusammenfassungen aggregieren Ereignistypen und nicht leere Akteure.

Das Modul kontaktiert keinen externen Analyseanbieter. Betreiber sind für geeignete Ereignisnamen, minimale Metadaten, Aufbewahrungsregeln für die Modultabelle und beschränkten administrativen Zugriff verantwortlich.

## Referenz

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Namensprüfung

`npm test` prüft Bindungsnamen mit dem lokalen Syntaxbaumdetektor einschließlich Bootstrap, Skripten, Tests und Testdaten. Syntaxfehler lassen die Prüfung fehlschlagen. Die Regressionstestfälle decken Deklarationen, Parameter, private Mitglieder, TypeScript-Typzusicherungen und zulässige reine Typnamen ab. Die gemeinsamen Regeln beschreibt der [Namensstandard des Hosts](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.de.md#bindungsnamen). Übliche Begriffe wie `args`, `db` und LDAP-`dn` sind zulässig; eigene APIs verwenden denselben kanonischen Namen in Deklarationen, Exporten und Aufrufern. Reine Umbenennungsaliase für Exporte lassen die Prüfung fehlschlagen.
