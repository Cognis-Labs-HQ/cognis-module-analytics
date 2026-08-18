# Analytics Content

Modul-eigene Inhalte liegen unter Modulpfaden und werden nur geladen, wenn das Modul aktiviert ist.

## Berichtsoberfläche

Die Admin-Ansicht vereint Kontozustand, Registrierungstrends, Rollenverteilung,
Ereignismix und eine Audit-Ansicht der neuesten Ereignisse. Alle API-Routen
erfordern eine Administratorrolle. Ereignismetadaten verbleiben im Besitz des
Moduls, Ereignis-Nachrichtenkörper sind auf 16 KiB begrenzt und das Modul sendet
keine Telemetrie an externe Dienste.

Operatoren können `analytics:metrics`, `analytics:series [days]`,
`analytics:event-summary [days]` und `analytics:activity-log [limit]` über die
CLI verwenden. Produzenten können Ereignisse aus der Zulassungsliste über
`analytics:activity-log:record <event-type> [meta-json]` aufzeichnen; Metadaten
dürfen keine Geheimnisse oder sensiblen personenbezogenen Daten enthalten.

## Externe Bereitstellung

Analytics ist für die Auslagerung nach `Cognis-Labs-HQ/cognis-module-analytics` vollständig eigenständig. Das Manifest deklariert `db:executor` unter `requiresCapabilities`; das Modul darf erst starten, wenn Cognis diese Capability anbietet. Root-Manifest, Paket, Routen, Lizenz, Assets, CLI, API, UI, Migration, übersetzte Dokumentation und Integritäts-Hashes werden gemeinsam ausgeliefert.
