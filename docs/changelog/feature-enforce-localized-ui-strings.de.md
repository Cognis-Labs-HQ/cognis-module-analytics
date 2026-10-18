# Strikte UI-Lokalisierung

**Feature-Zweig:** `feature-enforce-localized-ui-strings`

## Sprachschlüssel ohne wörtliche Ersatztexte verlangen

Die KI-Anweisungen verbieten fest kodierte englische Benutzertexte in allen Abläufen. Fehlende Werte der bevorzugten Sprache dürfen dieselben Schlüssel der englischen XML-Ressourcen verwenden. Fehlende oder leere englische Ersatzwerte müssen ausdrücklich einen Fehler auslösen, statt englische Literale, rohe Schlüssel oder leeren Text anzuzeigen. Fehler wegen fehlender Übersetzungen dürfen nicht unterdrückt werden.

## Änderungen

- [403cdf6](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/403cdf671712eebb72a46bdc5cfa9b2a9481ed06)
