# Was ist XSS (Cross Site Scripting) ?
Bei XSS wird auf einer Seite Script-Code eingebunden, welcher eigentlich nicht eingebunden werden sollte. 
Über ein dann eingebunden Script können diverse weitere Angriffe nachgeladen werden, die Seite manipuliert werden oder Ähnliches. 
Dabei ist zu bedenken, dass JavaScript immer nur im Client-Browser ausgeführt wird. Es ist jedoch teilweise über weitere Schwachstellen im Browser möglich, aus dem besonders abgesichertem Browser JavaScript-Bereich auszubrechen und so das Host-System anzugreifen.

Eine Gefahr bei XSS-Angriffen ist es, dass JavaScript sämtliche Elemente auf der Webseite manipulieren kann. So wäre es z.B. denkbar, dass die Kontonummer des Empfängers einer Überweisung so manipuliert wird, dass das Geld an den Angreifer überwiesen wird. 
Außerdem ist es möglich die Cookies des aktuellen Domain ausgelesen und an den Angreifer gesendet werden können. Mit diesen Cookies ist es dann ggf. möglich an sensible Daten zu kommen oder den Cookie selber zu verwendet um sich so "einzuloggen" (Cookie Replay).

## Reflected
Hierbei wird vom Programm eine Eingabe des Benutzers auf einer nachfolgenden Seite ausgegeben. Ein Beispiel wäre die Suche auf einer Webseite, der Suchbegriff wird auf der Ergebnisseite wiederholt. 

## Persistent
Hierbei wird der XSS-Angriff auf dem Server gespeichert und bei einem wiederholten Aufruf ausgeführt. Dies ist z.B. möglich, in dem in eine Kommentarfunktion entsprechender Schadcode eingefügt wird. 
Auch wenn der Schadcode auf dem Server gespeichert ist, richtet er dort keinen direkten Schaden an, der Schaden entsteht erst wenn dieser vom Client geladen und ausgeführt wird.

## DOM 
Bei den vorherigen zwei Angriffen wurde der Schadcode immer erst an den Server gesendet, welchen den Schadcode dann in einer Antwort an den Client ausgeliefert hat. Dementsprechend könnte der Schadcode auf Serverseite herausgefiltert werden.
Bei diesem Angriff wird jedoch ausschließlich Client-seitig angegriffen. Wenn die Webseite z.B. einen GET-Parameter direkt auf der Seite wieder anzeigt, lässt sich dieser Parameter angreifen. Auf dem Client würde also das gutartige JavaScript laufen, welches dann den GET-Parameter verarbeitet und den darin enthaltenen bösartigen JavaScript-Schadcode auf der Seite einfügt.

# Angrifssbeispiele

## Angriff 1 : Reflected
```html
<form method='get'>
    <input name=search type=text></input>
    <input type=submit value="Suchen"></input>
</form>
```
```php
echo "Ihre suche nach: " . $_GET["search"] . " ergab folgende Treffer:";
```
In diesem Beispiel werden sämtliche an der Form eingegebenen Zeichen, welche per GET übermittelt werden, auf der Seite ausgegeben. 

## Angriff 2 : Persistent
```php
if(isset($_POST["submitEntry"])) {
    $stmt = $conn->prepare("insert into entry(author, text) values(?, ?);");
    $stmt->bind_param("ss", $_POST["author"], $_POST["text"]); 
    if(isset($stmt)) $stmt->execute();
}
$sqlQuery = "SELECT author, text from entry";
$result = $conn->query($sqlQuery);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
          echo "Author: " . $row["author"] . "<br>";
          echo "Beitrag: <br><div>". $row["text"] . "</div>"
    }
}
```
Hier findet weder eine Überprüfung des Inhaltes bei der Speicherung in der Datenbank, noch bei der Ausgabe der Daten statt.
Dadurch ist es möglichm in der Datenbank Schadcode zu speichern, welcher dann bei allen Benutzern ausgeführt wird, die diese Seite aufrufen.


## Angriff 3 : DOM
```js
document.write('Hallo: ' +  decodeURI(document.location.href.substring(document.location.href.indexOf("name=")+5)) + '>');
```
Dieser JavaScript-Code liest den GET-Paramter mit dem Namen `name` aus der URL heraus und gibt diesen dann auf der Seite aus. Daher ist es hier möglich, einen Angriff auszuführen, welcher nicht über den Server läuft, sondern ausschließlich auf dem Client.

# Szenario Beschreibung
Es ist aufgefallen, dass das Administratorkonto von fremden Benutzt wird. Dies ist aufgefallen, da einige Kommentare gelöscht wurden, welche nicht vom Admin selber gelöscht wurden. Außerdem gibt es einige Kommentare, welche Popups öffnen. 
Es wird daher vermutet, dass XSS-Schwachstellen exisiteren und somit der Cookie des Admin geklaut wurde. 

# Angriff
Der Webseiten Betreiber hat Ihnen zum Testen den folgenden Benutzer eingerichtet.

Benutzername: hacking4  
Passwort: hacking4

Zur überprüfung sollten Sie dafür sorgen, dass eine Alert-Box mit einer beliebigen Nachricht geöffnet wird. Beachten Sie dabei, dass zur Statusüberprüfung lediglich die allerletzte Suche bzw. Fehlerseite beachtet wird.

1. Loggen Sie sich in Ihrem Benutzerkonto ein und verschaffen Sie sich einen Überblick über Elemente die für einen Angriff interessant sein könnten.  
2. Finden Sie eine Möglichkeit reflected XSS-Angriffe auszuführen
3. Finden Sie eine Möglichkeit persistent XSS-Angriffe auszuführen
4. Finden Sie eine Möglichkeit DOM XSS-Angriffe auszuführen


## Tipps
1. .
2. Schauen Sie sich die Startseite an, welche Paramter könnten hier manipuliert werden?
3. Ermitteln Sie, wo auf der Seite dauerhaft etwas gespeichert werden kann.
4. .
   1. Versuchen Sie eine ungültige Seite aufzurufen.
   2. Versuchen Sie die Artikelseite mit einer manipulierten id aufzurufen


# Lösung
1. .
2. `<script>alert()</script>` In die Suchleiste eingeben.
3. `<script>alert()</script>` In als Kommentar eingeben.
   1. `fehler<script>alert()</script>` als URL aufrufen.
   2. `article.php?id="><script>alert()</script>` als URL aufrufen.

# Verteidigung
Die Verteidigung ist stark davon abhängig wo der potenziell gefährliche Text verwendet werden soll. 
Einige Techniken sind dabei aber für die meisten Fälle anwendbar. Sie sollten sich dennoch vorher über die neusten Techniken informieren, welche für Ihren genauen Anwendungszweck empfohlen werden.

## Benutzereingabe bereinigen
Bei dieser Methode werden alle Zeichen durch einen Filter entfernt, welche prinzipiell gefährlich werden könnten. Beispielsweise werden die Zeichen `<` und `>` entfernt. Es ist aber zu beachten, dass ggf. Zeichen vergessen werden könnten oder die Zeichen anders kodiert werden könnten, um so diesen Filter zu umgehen.

## HTML-Entity formatieren
Zeichen, welche oft für einen XSS-Angriff genutzt werden, können als HTML Entity formatiert werden. Dies führt dazu, dass die Zeichen im Browser immer noch genau gleich angezeigt werden, diese aber nicht mehr für einen XSS-Angriff genutzt werden können. 
`&` wird dabei beispielsweise zu `&amp` und `<` zu `&lt`.
```php
//Schlecht:
echo $_GET["input"];
//Besser:
echo htmlspecialchars($_GET["input"]);
```


## Sämtliche Tags filtern
Eine weitere Möglichkeit ist es, sämtliche Tags zu filtern. Durch die Filterung des Tags `<script>`, wird der Inhalt entsprechend nicht mehr vom Browser ausgeführt.

```php
//Schlecht:
echo $_GET["input"];
//Besser:
echo strip_tags($_GET["input"]);
```

# Verteidigung - Szenario
1. Schließen Sie die Sicherheitslücken auf der Artikelseite
2. Schließen Sie die Sicherheitslücken auf der Startseite

## Tipps
Nutzen Sie dafür am besten die Techniken aus dem vorherigem Kapitel.

# Zusammenfassung
Wie Sie in diesem Szenario gesehen haben, lassen sich XSS-Schwachstellen relativ einfach von außen aufspüren und ausnutzen. Außerdem haben Sie jedoch gesehen, dass sich solche Schwachstellen relativ einfach im Programm beheben lassen.
Sie sollten sich also bei der Entwicklung von Programmen, welche Benutzereingaben zulassen, immer im Klaren sein, dass ein besonderes Risiko besteht. 