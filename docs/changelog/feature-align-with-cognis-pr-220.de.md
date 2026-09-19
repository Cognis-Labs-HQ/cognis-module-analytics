# Analytics an die aktuelle Struktur externer Module anpassen

**Feature-Zweig:** work

## Laden ausschließlich über Bootstrap

Der veraltete API-Manifest-Einstiegspunkt wurde entfernt, sodass Cognis das aktivierte Analytics-Modul ausschließlich über `entrypoints.bootstrap` und `bootstrapModule(ctx)` lädt. Der dedizierte Einstiegspunkt für den deaktivierten Zustand bleibt für den Modul-Lebenszyklus verfügbar.

## Sicherere Fehlerprotokollierung

Analytics protokolliert Fehler beim Schreiben von Aktivitäten jetzt über den Host-Logger mit sicheren Komponenten- und Operationsmetadaten, bevor der allgemeine API-Fehler zurückgegeben wird.

## Vertragsprüfung und Dokumentation

Der Strukturvertragstest und alle lokalisierten Standards wurden aktualisiert. Version 2.1.5 enthält außerdem neu erzeugte Paketintegritäts-Hashes.

## Änderungen

- [f111f3c](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/f111f3c2c724f56b6bb7035bed174f9130a8b2db)
