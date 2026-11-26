# Anwendung

Prüfen Sie Kontoaktivität und moduleigene Ereignisberichte ohne externen Analysedienst.

## Voraussetzungen

Melden Sie sich nach Aktivierung des Moduls als Administrator an. Vollständige Berichte benötigen Datenbank- und Kontodienste.

## Beispiele

Öffnen Sie Analytics in der Administration, wählen Sie einen Berichtszeitraum und aktualisieren Sie zeitabhängige Diagramme vor dem Lesen.

Öffnen Sie den Bereich **Analytics** in der Cognis-Administration, um Kontosummen, aktivierte Konten, Aktivität der letzten sieben Tage, Inaktivität seit 30 Tagen, Rollenverteilung, Registrierungstrends, Ereignissummen und aktuelle Ereignisse zu prüfen. Wählen Sie einen Zeitraum von 7, 30 oder 90 Tagen und aktualisieren Sie die Ansicht.

Dieselben Verträge sind über die CLI verfügbar:

```sh
cognisctl modules:analytics:metrics
cognisctl modules:analytics:series 30
cognisctl modules:analytics:eventSummary 30
cognisctl modules:analytics:activityLog 20
```

Zeichnen Sie ein modul-eigenes Ereignis mit optionalen JSON-Metadaten auf:

```sh
cognisctl modules:analytics:activityLog:record report_exported '{"format":"csv"}'
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

Der Ablauf erklärt Analysefilter und Diagramm in der Administration. Er erfordert eine Administratorsitzung und eine Serververbindung.

## Erwartete Ergebnisse

Berichte zeigen berechtigte Kontoinformationen und moduleigene Ereignisse im gewählten Zeitraum. Ereignisübermittlung sendet keine Telemetrie an einen externen Analysedienst.

## Fehlerbehebung

Aktualisieren Sie veraltete Diagramme, prüfen Sie Administratorrechte und bei Fehlern die Dienstverfügbarkeit. Ereignismetadaten dürfen keine Geheimnisse oder privaten Nachrichten enthalten.
