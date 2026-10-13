# Modul an die Entwicklungsvorlage anpassen

**Feature-Zweig:** feature-align-module-template

## Standardstruktur und eigene Integration

Vorlagenrichtlinien, domänenspezifische Routenpfade, übersetzte Integrationsdokumentation, ausführbare Strukturprüfungen und endgültige Paket-Hashes synchronisieren. Öffentliche URLs und Modulidentität bleiben erhalten. Browserbeiträge folgen den Lebenszyklusverträgen des zuständigen Hosts.

## Öffentliche Kontoberichte und validierte Bereiche

Berichte verwenden die öffentliche Konto-Capability von Auth statt fremder Tabellen und führen eigene ctx-Abläufe aus. Explizite Limits bleiben erhalten, ohne Limit werden alle Ereignisse geliefert und ungültige Bereiche abgewiesen. Installierte Befehle verwenden `modules:analytics:*`. Styles und Fehlermeldungen nutzen Host-Verträge; unregistrierte Dashboard-Vorlagen und der leere Deaktivierungs-Einstiegspunkt entfallen.

## Änderungen

- [18d275a](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/18d275abab31c87c35e0f44dcf87918ec6b40b8d)
