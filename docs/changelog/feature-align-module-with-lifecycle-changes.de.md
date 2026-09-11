# Aktivierung des Analytics-Moduls wiederherstellen

**Feature-Zweig:** feature-align-module-with-lifecycle-changes

## Einhaltung der Lebenszyklusgrenzen

Eine mitgelieferte Fixture mit einer ungültigen Route, die den Namensraum eines anderen Moduls adressierte, wurde durch eine inaktive Modulquelle ersetzt. Dadurch überschreiben Aktualisierungen die verletzende Datei. Die Analytics-Laufzeitquellen bleiben nun im moduleigenen API-Namensraum.

## Regressionstest und Release-Metadaten

Ein Grenzregressionstest für Laufzeit-API-URLs wurde ergänzt, der validierte Lebenszyklusvertrag in allen unterstützten Sprachen dokumentiert und die Release-Version auf 2.1.4 synchronisiert.

## Isolierter deaktivierter Lebenszyklus

Analytics deklariert nun einen dedizierten API-Einstiegspunkt für den deaktivierten Zustand und folgt damit der Lebenszyklusstruktur anderer externer Module. Da Analytics keine Konfiguration vor der Aktivierung benötigt, registriert dieser Einstiegspunkt bewusst keine Routen oder Capabilities und führt keine Laufzeitarbeit aus. Automatisierte Tests prüfen diesen inaktiven Vertrag.

## Vollständige Einhaltung der Grenzen

Die verbleibende absolute Schriftgröße der Diagrammbeschriftung verwendet nun eine einstellungsrelative Einheit; zusätzlich prüft ein Regressionstest auf absolute CSS-Schriftgrößen. Die inaktive Ersatzquelle und die relative Typografie ermöglichen sowohl aktualisierten als auch neu installierten Modulen, die vollständige Grenzprüfung des Hosts zu bestehen.

## Änderungen

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)

- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)

- [7773003](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/7773003e1c1c7913b3e4e5eb534141a7e90f252d)
