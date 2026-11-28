# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Berichte für schmale Bildschirme

Berichtszeilen verwenden die kompakte Composer-Darstellung und zeigen Ereignisbalken unter Bezeichnung und Anzahl. Summen und Filter brechen um; Tabellen mit festen Spaltenanteilen erlauben den Umbruch von Zeitstempeln auf schmalen Bildschirmen und behalten die Schrift- und Theme-Einstellungen des Hosts bei.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung erfasst JavaScript- und TypeScript-Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Sie prüft Laufzeitbindungen, Signaturparameter, private Mitglieder sowie eigene zusammengesetzte Typ- und Methodennamen. Übliche Kurzformen bleiben als direkte Namen wie `db`, `this.db`, `args` und LDAP-`dn` zulässig. Zusammengesetzte Namen schreiben ihre Wörter aus, auch bei übernommenen Bezeichnern: `DatabaseExecutor`, `KeyringDatabaseExecutor`, `createDatabaseExecutor`, `baseDistinguishedName` und `registerStaticDirectory`. Undurchsichtige Kurzformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Ein ungenutztes, nicht exportiertes `_`, `id` und arithmetische `i`/`j`/`k`-Zähler behalten ihre festgelegten Rollen. Generische Typparameter, kanonische Abhängigkeits- und Plattformnamen sowie öffentliche Nutzdatenschlüssel behalten ihre Verträge. Eigene API-Deklarationen, Importe, Exporte und Aufrufer verwenden denselben Namen; reine Umbenennungsaliase einschließlich Typaliasen schlagen fehl. Regressionstestfälle sichern die Unterscheidung direkter und zusammengesetzter Namen sowie kanonische Plattform-APIs. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert.

## Änderungen

- [3e91917](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/3e9191776d8df2cb1a3e0f57b18efd76a124b894)
- [5cf0109](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5cf0109d1f912d473d87a82758ac2aca033a8ddf)
- [278e8c9](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/278e8c9371ad3dd631671314d29ef1fce8b541c3)
- [9ae1d59](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/9ae1d590121911358a6a7aa6666d1b8e5f3299b7)
- [c0cf61b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c0cf61b731fc0a709e187fef06067d98b9375aee)
