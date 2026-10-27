# Übertragung und Zustimmung

**Feature-Zweig:** feature-offline-delivery

## Kontobezogene Bereinigung

Der lebenszyklusgebundene Hook `analytics:deleteAccountActivity` erweitert `deprovision-user` in `cleanup-dependencies`. Nach einer gespeicherten Kontolöschung wartet er auf die Schemainitialisierung und löscht nur Ereignisse mit dem passenden Kontohash. Dafür verwendet er dieselbe SHA-256-Ableitung wie die authentifizierte Erfassung. Andere Konten und anonyme Administratorereignisse bleiben erhalten. Deaktivierung, Archivierung und abgelehnte Löschanfragen behalten die Aktivitäten bei. Fehler werden protokolliert und weitergegeben; der Host entfernt den Hook beim Beenden des Modulkontexts vor einer erneuten Aktivierung.

## Übertragung und Zustimmung

Analytics erfasst authentifizierte Aktivitäten über `POST /api/v1/modules/analytics/activity` und den Browserablauf `analytics:recordActivity`. Kontogebundene Idempotenzschlüssel verhindern Duplikate; ursprüngliche Zeiten bleiben erhalten. Navigation und vorgemerkte Study-Aktionen liefern nur sichere skalare Metadaten (`component`, `action`, `result`, `count`, `durationMs`); andere Daten werden vor dem Speichern abgelehnt. Berichte verwenden Konto-Hashes. Deaktivieren entfernt Handler und Listener.

Der Host stellt `offline:outbox`, `offline:state` und `offline:accessPolicy` über ctx bereit. Komponenten registrieren Übertragungshandler für ihre Anbieter-Lebensdauer und stabile IDs über `offline:enqueue`; `offline:flush` autorisiert und überträgt. Die dauerhafte kontogebundene Warteschlange umfasst höchstens 1.000 Einträge und 1 MB für sieben Tage, ohne Tokens. IDs und Zeitstempel bleiben erhalten; temporäre Fehler werden wiederholt, bestätigte oder dauerhaft abgelehnte Einträge entfernt. Eine lokalisierte Warnung meldet Ablehnungen. Abmelden leert die Konto-Warteschlange; andere Konten erhalten keine fremden Einträge. Deaktivieren stoppt neue Offline-Einträge. Vorhandene Einträge können online übertragen werden.

## Hintergrunddaten und Warnungen

Analytics registriert seinen Übertragungsanbieter mit `protectOnClose: false` in der Host-Warteschlange. Navigations- und Aktivitätsdaten bleiben dauerhaft gespeichert und werden nach autorisierter Wiederherstellung, auch durch die manuelle Verbindungsprüfung, übertragen. Sie lösen keine Schließwarnung des Browsers mehr aus. Benutzeränderungen behalten den Standardschutz des Hosts. Dies erfordert den aktualisierten Klassifizierungsvertrag des Hosts.

## Änderungen

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
- [c6b5760](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6b57608b93128f46fe849c7a385805ab8ab0e55)
- [956bf8d](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/956bf8de31d3c13e885cbd6a28611ba0b78c5175)
- [221efac](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/221efac097286f2fe90809303620d35bfa873fef)
