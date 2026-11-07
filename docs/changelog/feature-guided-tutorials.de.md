# Geführtes Tutorial

**Feature-Zweig:** feature-guided-tutorials

## Technische Spezifikation

Der Ablauf erklärt Analysefilter und Diagramm in der Administration. Er erfordert eine Administratorsitzung und eine Serververbindung.

Das Modul registriert seinen Ablauf und übersetzte Texte über ctx. Der Host verwaltet Katalog, Hinweise, Pfeile, Hervorhebung, Tastatur- und Zeigersteuerung, geschützte SPA-Navigation und Barrierefreiheit. Schließen, fremde Navigation, Zugriffsverlust oder Deaktivierung beenden die Sitzung. Scheitert das Einhängen des Anbieters, werden seine Registrierungen zurückgenommen.

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

## Seitengebundener Erstbesuch

Der Host verwaltet Hinweise, Pfeile, Hervorhebung, Barrierefreiheit und das gemeinsame schwebende Aktionsmenü. Erstdurchläufe bieten stets Weiter, ohne Abbrechen oder Überspringen. Wiederholungen bieten Abbrechen mit `btn-cancel`. Der Abschluss wird im Browser pro Konto gespeichert. Navigation, Zugriffsverlust und Anbieterentfernung beenden die Sitzung; fehlgeschlagenes Mounten nimmt Registrierungen zurück.

## Konkrete Anleitungstexte

Die Schritte beschreiben verfügbare Bedienelemente und Aufgaben, ohne sachfremde Zusicherungen über Berechtigungen oder nicht ausgeführte Aktionen.

## Weiter-Hinweise pro Schritt festlegen

Jeder Tutorial-Schritt legt `highlightNext` ausdrücklich fest: Erklärungen, die Weiter oder Fertig benötigen, aktivieren den Hinweis; interaktive und wartebasierte Übungen deaktivieren ihn. Bei reduzierter Bewegung bleibt eine statische Umrandung.

Alle UI-Komponenten benötigen eine Anleitung. Die Beitragsrichtlinien verlangen nutzerorientierte Aufgabenabläufe und eine Prüfung bestehender Anleitungen bei neuen Funktionen oder geänderter Bedienung.

## Sichtbare Tutorial-Ziele

Tutorial-Ziele und Weiter-Hinweise sind ausdrücklich festgelegt.

## Gemeinsame Menüwarteschlange

Menüs folgen der gemeinsamen Host-Warteschlange und der Komponentenlebensdauer.

## Dokumentierte Wiederherstellungsaktionen

Bei fehlenden Zielen stehen Weiter und Tutorial neu starten bereit; Wiederholungen bieten auch Abbrechen.

## Gezielte Tutorialführung

Anleitungen erklären unterschiedliche sichtbare Bedienelemente in UI-Reihenfolge. Die gemeinsamen Vorgaben behandeln aktive Ansichten, stabile Beispiele, Leerzustände, bedingte Zweige und Lebensdauerbereinigung. Wiederholungsaktionen und Dokumentation zu reduzierter Bewegung entsprechen dem gemeinsamen Host.

## Änderungen

- [c94a229](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c94a229fbd1e0f68a8bee382180dd7734aa8e6a2)
- [2f45c6b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/2f45c6b185472dae1846ee7c66cf2ec832c17028)
- [1d84d69](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/1d84d69054daa49d6f6bf9c95d02f0005654b412)
- [5fff2b0](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5fff2b07337f60998f18f2cd8629e943271db7fd)
- [c4d5e25](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c4d5e251629e45a50090f40e3d003243cd744449)
- [ed63571](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/ed6357135a3def805ecd524df994a8897de4e27a)
- [1345101f0](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/1345101f062e36f53e25e5bc7ff168b3a1bc9e08)
