# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Berichte für schmale Bildschirme

Berichtszeilen verwenden die kompakte Composer-Darstellung und zeigen Ereignisbalken unter Bezeichnung und Anzahl. Summen und Filter brechen um; Tabellen mit festen Spaltenanteilen erlauben den Umbruch von Zeitstempeln auf schmalen Bildschirmen und behalten die Schrift- und Theme-Einstellungen des Hosts bei.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung untersucht Deklarationen, Exporte, Destrukturierungen, Laufzeit- und Typsignaturparameter, Konstruktor-Parametereigenschaften, Catch-Bindungen, Importe, benannte Funktionen und Klassen, Laufzeitbindungen von Enums und Namensräumen sowie private Mitglieder unabhängig von der Formatierung. Sie erfasst Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Undurchsichtige Kurzformen, abgekürzte Pluralformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Übliche Entwicklerbegriffe wie `args`, `db`, LDAP-`dn`, HTTP-`req`/`res`, `env`, `opts` und `params` bleiben zulässig; das Glossar definiert den vollständigen Wortschatz. Weitere kurze Ausnahmen sind ein ungenutztes, nicht exportiertes `_`, `id` und numerische `i`/`j`/`k`-Zähler mit passenden arithmetischen Aktualisierungen. Koordinaten und Abmessungen erhalten aussagekräftige lokale Namen. Eigene Hilfs- und Speicher-APIs verwenden ihre aussagekräftigen Namen direkt in Deklarationen, Exporten, Importen und Aufrufern; reine Umbenennungsaliase für Importe und Exporte schlagen fehl. Verbraucher müssen die kanonischen Exporte statt verkürzter Aliase verwenden. Öffentliche Nutzdatenschlüssel, Fähigkeitsbezeichner und reine Typbezeichner behalten ihre Vertragsrollen. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert.

## Änderungen

- [3e91917](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/3e9191776d8df2cb1a3e0f57b18efd76a124b894)
- [5cf0109](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5cf0109d1f912d473d87a82758ac2aca033a8ddf)
- [278e8c9](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/278e8c9371ad3dd631671314d29ef1fce8b541c3)
- [9ae1d59](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/9ae1d590121911358a6a7aa6666d1b8e5f3299b7)
