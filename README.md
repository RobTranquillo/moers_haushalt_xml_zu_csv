# moers_haushalt_xml_zu_csv

Konvertiert die Haushaltsdaten von Moers von XML zu CSV
Quelle: http://www.moers.de/C1257221003C7526/html/B2DEA28118BBFC88C1257B0A0056F933?opendocument

# Motivation: 
- [@derArndt auf twitter](https://twitter.com/derarndt/status/522290389467004928)
- [Anforderungsbeschreibung](http://download.moers.de/Schule%20und%20Open%20Data/Problemskizze%20Projekt%20Open%20Data%20und%20Schule.txt)

## Hinweise:
Entgegen der Anforderung keine Kommata in den Zellen zu zulassen, hab ich mich dafür entschieden keine Zelleninhalte zu verändern, in dem vorhandene Kommas in Texten hätten entfernt werden müssen. Sondern ich habe alle Texte in Hochkommata (") gesetzt, das sollte hoffentlich für die meisten Importprogramme auch valides CSV produzieren.

Auch wurde in der aktuellen Version noch lange nicht alle möglichen Posten eigebunden, was aber sehr leicht im script zu machen ist. Ebenso wurde noch nicht genau auf die Knoten "Investitionsmaßnahme" eingegangen. Diese Sind zwar enthalten aber müssen noch auf Vollständigkeit geprüft werden.  


Astro war wieder ein bischen eher fertig: https://github.com/astro/moers-haushalt

Hier ist Platz für weitere Diskussionen:
https://robtranquillo.wordpress.com/2014/10/18/moers-fragt-dresden-antwortet-opendata-yeah-o


# Erklärung

Im script selber sind ein paar Konfigurationsmöglichkeiten ausserdem ist das XML Schema abgebildet, damit kann ein eigenes CSV Format erstellt werden


script mit nodeJS starten:
```
$ node convert.js
```
