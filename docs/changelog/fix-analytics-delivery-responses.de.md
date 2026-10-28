# Zustellantworten prüfen

**Feature-Zweig:** fix-analytics-delivery-responses

## Zustellantworten prüfen

Analytics bestätigt vorgemerkte Aktivitäten erst nach einer erfolgreichen JSON-Antwort ohne Weiterleitung, die die gespeicherte Ereignis-ID enthält. HTML, leere oder ungültige Inhalte und fehlende IDs erzeugen einen wiederholbaren Zustellfehler der Klasse 502; die ursprüngliche Ereignisidentität bleibt für einen späteren Versuch erhalten. Ungültiges JSON wird mit sicheren Statusmetadaten protokolliert; Antwortinhalte werden niemals protokolliert.

## Änderungen

- [221efac](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/221efac097286f2fe90809303620d35bfa873fef)
- [84316b7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/84316b71a2250f56b4c189ff612ccc83e6b9eec7)
