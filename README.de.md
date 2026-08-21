# Cognis Analytics

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Datenschutzbewusste Nutzungsanalysen und administrative Berichte für Cognis. Erfasse Registrierungstrends, Aktivierung, Kontozustand, Rollenverteilung und moduleigene Ereignisse, ohne einen externen Analysedienst einzubinden.

Dieses Repository ist ein eigenständiges Cognis-Erweiterungsmodul. Installiere es über den Modul-Marktplatz oder lege es im konfigurierten Verzeichnis für externe Module ab. Informationen zu Konfiguration, Capabilities, Routen und Betrieb findest du in [`docs/standard.de.md`](docs/standard.de.md); gleichwertige englische, indonesische und japanische Referenzen liegen daneben.

## Analyseumfang

- Gesamtzahl der Konten, aktivierter und deaktivierter Status, Aktivität der letzten sieben Tage und 30-tägige Inaktivität
- Registrierungszeitreihen für konfigurierbare Zeiträume von 7, 30 oder 90 Tagen
- Datenschutzbewusste Erfassung benutzerdefinierter Ereignisse mit einem Anfragelimit von 16 KiB
- Zusammenfassungen zu Ereignisvolumen, eindeutigen Akteuren und Ereignistypen
- Durch Host-Autorisierung geschütztes Admin-Dashboard und CLI-Zugriff

## Erste Schritte

```sh
npm install
npm test
npm run check:manifest
```

Das Manifest veröffentlicht die moduleigenen Sprachpakete über `ui.stringsBaseUrl`, sodass Cognis die Marktplatz-Metadaten lokalisieren kann, bevor die Analytics-Oberfläche geladen wird.
