# Aktivierung des Analytics-Moduls wiederherstellen

**Feature-Zweig:** work

## Einhaltung der Lebenszyklusgrenzen

Eine mitgelieferte Fixture mit einer ungültigen Route wurde entfernt. Sie adressierte den Namensraum eines anderen Moduls und führte dazu, dass Cognis die Analytics-Laufzeitquellen bei der Aktivierung durch die Grenzvalidierung ablehnte. Die Analytics-Laufzeitquellen bleiben nun im moduleigenen API-Namensraum.

## Regressionstest und Release-Metadaten

Ein Grenzregressionstest für Laufzeit-API-URLs wurde ergänzt, der validierte Lebenszyklusvertrag in allen unterstützten Sprachen dokumentiert und die Release-Version auf 2.1.2 synchronisiert.

## Änderungen

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)
