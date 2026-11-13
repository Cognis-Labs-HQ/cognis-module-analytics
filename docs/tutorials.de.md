# Geführtes Tutorial

Dieses Modul bindet seinen Einführungsablauf über `ui:tutorials` an seine eigene Seite. Beim ersten zulässigen Besuch startet er automatisch; das Fragezeichen-SVG neben dem Seitentitel wiederholt ihn. Der Host muss den seitengebundenen Tutorialvertrag der Version eins bereitstellen.

## Anwendungsbeispiele

Der Ablauf erklärt Analysefilter und Diagramm in der Administration. Er erfordert eine Administratorsitzung und eine Serververbindung.

## Technische Spezifikation

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

Der gemeinsame Host stellt schwebende Aktionen über seine Warteschlange bereit. Erstbesuche bieten Weiter/Fertig ohne Abbrechen oder Überspringen; Wiederholungen bieten Überspringen vor dem letzten sichtbaren Schritt. Neustart erscheint nach dem ersten sichtbaren Schritt. Abschlüsse bleiben nach Inhaltsänderungen gültig. Ausdrückliche highlightNext-Angaben aktivieren nur die Atemanimation für Erklärungen; reduzierte Bewegung deaktiviert sie. Jeder Schritt hebt ein anderes reales Bedienelement in UI-Reihenfolge hervor. Anleitungen bleiben an die aktuelle Ansicht gebunden, behandeln leere und optionale Zustände und räumen bei Navigation oder Besitzerentfernung auf.

## Vor dem Lesen des Diagramms aktualisieren

Die Übung zum Berichtszeitraum umfasst die Auswahl eines Zeitraums und das Klicken auf Aktualisieren. Sie wird erst fortgesetzt, wenn alle Berichtsabfragen und das Einlesen der Antworten erfolgreich abgeschlossen sind und der Bericht angezeigt wird. Allein das Ändern der Auswahl, eine fehlgeschlagene Anfrage oder das Schließen des Abschnitts setzt die Übung nicht fort. Nach Fehlern stehen die Bedienelemente für einen erneuten Versuch bereit; während der Aktualisierung sind Zeitraum und Aktualisieren vorübergehend deaktiviert.
