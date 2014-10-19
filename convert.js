/*
     Schema:
      +haushaltsplanung
        +meta
            +mandant
            +kostenrechnungskreis-finanzkreis
            +geschaeftsjahre
  
        +module
            +modul (param: typ="ERGHHG")
                +ueberschriften (param: ifp:lable="Überschriften")
                    +ueberschrift
                        +bezeichnung
                    +freitext1
                    +freitext2
                    +positionen
                        +position
                            <ANS_PLJ>
                            <ANS_VJ>
                            <PLAN_FJ1>
                            <PLAN_FJ2>
                            <PLAN_FJ3>
                            <PLAN_FJ4>
                            <RE_VVJ>
                            <RE_VJ3>
                            <ROW_NR>
                            <ROW_TEXT> (ethält den Text zur Position, in den anderen Feldern sind die Werte)
                            <TXTSONST/>
                +investitionsmassnahmen
                    +investitionsmassnahme
                        +positionen>
                            +position
                                +stammdatum
                                +stammdatum
                            +position
                                <ERM_VVJ>
                                <ANS_PLJ>
                                <ANS_VJ>
                                <PLAN_FJ1>
                                <PLAN_FJ2>
                                <PLAN_FJ3>
                                <PLAN_FJ4>
                                <PLAN_FJ5>
                                <RE_VVJ>0
                                <RE_VJ3>
                                <ROW_NR>
                                <ROW_TEXT>
                                <TXTSONST>
                                <TXTVZ>
                                <SUM_VE>
                                <VE_FJ1>
                                <VE_FJ2>
                                <VE_FJ3>
                                <VE_FJ4>
                                <VE_FJ5>
                                <BER_GEL>
                                <BUD_BER>
                                <GES_E_A>
                                <GES_EA_GEN>
 *
 *
 *  ZIELVORGABE:
 * Die CSV Datei für Openspending muss folgende Struktur haben:
    1. Sie benötigt eine Kopfzeile in der die Spaltennamen stehen 
    2. Mindestens 3 Spalten müssen (Betrag,Datum,Spender/Empfänger)
    3. Die Spalten müssen konsistent sein
    4. In den Zeilen darf es immer nur um eine Haushaltslinie gehen
    5. Keine leeren Reihen
    6. Keine Formeln hinterlegen (Openspending macht das automatisch)
    7. Jede Zeile braucht eine eigene ID
    8. Das Daten muss in folgendem Format sein : JJJJ:MM:TT
    9. Zahlen dürfen keine Kommata sondern nur Punkte enthalten
 * 
*/          


/*
 * EINSTELLUNGEN / CONFIG
 */
var input_xml_path = './moers.xml';
var output_csv_path = './moers2.csv';
var headline_seperator = ' / ';  // mehere Unterüberschriften werden damit optisch getrennt und zusammen in EIN Überschrift-Feld geschrieben
var kopfzeile = ["id","typ","ueberschrift","kalk_position","ANS_PLJ","ANS_VJ","PLAN_FJ1","RE_VVJ"];

/*
 * DateiObjet erzeugen, Datei einlesen
 * Cheerio (enthält den jQuery-Kern) laden
 * Dateiinhalt in CheerioObjekt verwandeln
 *
 */ 
var fs = require('fs');
var file_buf = fs.readFileSync(input_xml_path);
var cheerio = require('cheerio');
var $ = cheerio.load(file_buf);
var csv_lines_array = [];




var id = 0;
    typ='', // typ einer Position
    hl='',  // hl = headline, Sub-Überschrift jeder position
    pos=[]; //Array der kalkulatorischen Positionen

// durchläuft alle module mit Namen "modul" und steckt sie in ein gemeinsames Array
$("module modul").each( function(mod_i,element) {
        typ = get_type( this );
        hl = subheadlines_combined( this );
        pos = positions ( this ); 

        //für jede Position die CSV Line bauen
        for( i_pos in pos ) {
            csv_lines_array.push( [id, typ, hl, pos[i_pos]].join() );
            id++;
        }
    });


//Ausgabe zusammensetzen
kopfzeile = kopfzeile.join() + "\n";
csv_file_buffer = kopfzeile + csv_lines_array.join("\n");
fs.writeFile(output_csv_path, csv_file_buffer);
//console.log(csv_file_buffer);



/*
 * Unter Positionen sind mehere Einzelpositionen zusammengefasst. 
 * Diese werden alle zusammengefasst und in einen String gepackt
 * Bekommt das Modul übergeben und sammelt sich aus dem einzelnen Modul zu jeder Position 
 * alle (hard gecodeten) Positions-Zahlen/Texte packt sie in einen String und
 * übergibt für jede Position ein Array-seqment
 */
function positions( modul )
{
    var pos_arr = [];
    if( $(modul).children("*").is("investitionsmassnahmen") )   // Um auch "investitionsmassnahmen" zu erfassen, wird der Knoten etwas tiefer gesetzt
        modul = $(modul).children("investitionsmassnahmen").children("investitionsmassnahme");
        
    modul = $(modul).children("positionen").children("position");
    modul.each(function(i,el){
        pos_arr.push (
            '"'+ $(el).children("ROW_TEXT").text() +'"'+','+
            $(el).children("ANS_PLJ").text() +','+
            $(el).children("ANS_VJ").text() +','+
            $(el).children("PLAN_FJ1").text() +','+
            $(el).children("RE_VVJ").text() 
            );
        
        })


    return pos_arr; 
}



/*
 * Gibt den bezeichnenden Typ des überladenen Moduls wieder 
 */
function get_type( modul )
{
    return $(modul).attr("typ"); // typ des aktuellen Moduls
}



/*
 * Unter einer Überschrift sind auch mal mehrere Unterüberschriften
 * Diese werden alle zusammengefasst und in einen String gepackt
 */
function subheadlines_combined( modul )
{
    var zw_hl = []; 
    $(modul).children("ueberschriften").children().children().each(function(hl_i,hl_element){
        //Alle Überschrifts Felder (inklusive "Nr." auslesen )
        var feld = $(this).text().trim();
        //leere Felder überspringen 
        if(feld != '' ) zw_hl.push( feld );
    });
  return '"' +zw_hl.join( headline_seperator )+ '"';
}
