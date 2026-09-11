# Aktivierung des Analytics-Moduls wiederherstellen

**Feature-Zweig:** work

## Einhaltung der Lebenszyklusgrenzen

Eine mitgelieferte Fixture mit einer ungültigen Route wurde entfernt. Sie adressierte den Namensraum eines anderen Moduls und führte dazu, dass Cognis die Analytics-Laufzeitquellen bei der Aktivierung durch die Grenzvalidierung ablehnte. Die Analytics-Laufzeitquellen bleiben nun im moduleigenen API-Namensraum.

## Regressionstest und Release-Metadaten

Ein Grenzregressionstest für Laufzeit-API-URLs wurde ergänzt, der validierte Lebenszyklusvertrag in allen unterstützten Sprachen dokumentiert und die Release-Version auf 2.1.3 synchronisiert.

## Isolierter deaktivierter Lebenszyklus

Analytics deklariert nun einen dedizierten API-Einstiegspunkt für den deaktivierten Zustand und folgt damit der Lebenszyklusstruktur anderer externer Module. Da Analytics keine Konfiguration vor der Aktivierung benötigt, registriert dieser Einstiegspunkt bewusst keine Routen oder Capabilities und führt keine Laufzeitarbeit aus. Automatisierte Tests prüfen diesen inaktiven Vertrag.

## Änderungen

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)

- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)
