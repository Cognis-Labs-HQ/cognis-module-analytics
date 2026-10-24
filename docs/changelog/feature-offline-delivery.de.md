# Übertragung und Zustimmung

**Feature-Zweig:** feature-offline-delivery

## Übertragung und Zustimmung

Analytics erfasst authentifizierte Aktivitäten über `POST /api/v1/modules/analytics/activity` und den Browserablauf `analytics:recordActivity`. Kontogebundene Idempotenzschlüssel verhindern Duplikate; ursprüngliche Zeiten bleiben erhalten. Navigation und vorgemerkte Study-Aktionen liefern nur sichere skalare Metadaten (`component`, `action`, `result`, `count`, `durationMs`); andere Daten werden vor dem Speichern abgelehnt. Berichte verwenden Konto-Hashes. Deaktivieren entfernt Handler und Listener.

Der Host stellt `offline:outbox`, `offline:state` und `offline:accessPolicy` über ctx bereit. Komponenten registrieren Übertragungshandler für ihre Anbieter-Lebensdauer und stabile IDs über `offline:enqueue`; `offline:flush` autorisiert und überträgt. Die dauerhafte kontogebundene Warteschlange umfasst höchstens 1.000 Einträge und 1 MB für sieben Tage, ohne Tokens. IDs und Zeitstempel bleiben erhalten; temporäre Fehler werden wiederholt, bestätigte oder dauerhaft abgelehnte Einträge entfernt. Eine lokalisierte Warnung meldet Ablehnungen. Abmelden leert die Konto-Warteschlange; andere Konten erhalten keine fremden Einträge. Deaktivieren stoppt neue Offline-Einträge. Vorhandene Einträge können online übertragen werden.

## Änderungen

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
