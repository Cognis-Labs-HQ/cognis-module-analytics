# Modul an die Entwicklungsvorlage anpassen

**Feature-Zweig:** feature-align-module-template

## Standardstruktur und eigene Integration

Vorlagenrichtlinien, domänenspezifische Routenpfade, übersetzte Integrationsdokumentation, ausführbare Strukturprüfungen und endgültige Paket-Hashes synchronisieren. Öffentliche URLs und Modulidentität bleiben erhalten. Browserbeiträge folgen den Lebenszyklusverträgen des zuständigen Hosts.

## Öffentliche Kontoberichte und validierte Bereiche

Berichte verwenden die öffentliche Konto-Capability von Auth statt fremder Tabellen und führen eigene ctx-Abläufe aus. Explizite Limits bleiben erhalten, ohne Limit werden alle Ereignisse geliefert und ungültige Bereiche abgewiesen. Installierte Befehle verwenden `modules:analytics:*`. Styles und Fehlermeldungen nutzen Host-Verträge; unregistrierte Dashboard-Vorlagen und der leere Deaktivierungs-Einstiegspunkt entfallen.

## Änderungen

- [b98c771](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/b98c7711c22d4b2e2488ef00653b78a64d22d9ad)
