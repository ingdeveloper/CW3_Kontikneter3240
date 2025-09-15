
<%

'################################################################################################################
'Uebergabe von Request-Parametern
parDbName=(unescape(Request("dbName")))
parAliasName=(unescape(Request("alias")))
parAnzahl=(unescape(Request("anzahl")))
parStart=(unescape(Request("start")))
parEnde=(unescape(Request("ende")))
'################################################################################################################



Dim conn
Dim erg 
erg = "Hallo"

Set con = Server.CreateObject("ADODB.Connection")
con.CommandTimeout = 10
'cn.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = Fuell3020; User Id = sa; Password = webfactory"
con.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = "& parDbName & "; User Id = sa; Password = webfactory"


Set rs  = Server.CreateObject("ADODB.Recordset")

CommandText= ""
'CommandText= CommandText & "EXEC [dbo].[sp_GetLogValues] N'" & parAliasName & "', " & parAnzahl   'StorageProcedure ansprechen, eine Art View in einer DB
CommandText= CommandText & "EXEC [dbo].[sp_GetLogValuesByDate] N'" & parAliasName & "', " & parAnzahl & ", '" & parStart & "', '" & parEnde & "'"  'StorageProcedure ansprechen, eine Art View in einer DB
rs.Open CommandText,con
	
if rs.BOF or rs.EOF then
		Response.Write("Keine Eintraege gefunden")
	rs.Close()
else

    varErgebnis = "{"
    dim t
    dim v
    dim frame
    t = "['x',"
    v = "['data3',"
    frame = "{"
    Do While NOT rs.Eof   

        t = t & chr(34) & rs("LoggingTime") & chr(34) & ","
        v = v & rs("LoggingValue") & ","
        
        rs.MoveNext     
    Loop

    t = Left(t, Len(t) - 1)  'letzte Komma abschneiden
    t = t & "]"

    v = Left(v, Len(v) - 1)  'letzte Komma abschneiden
    v = v & "]"
    

    rs.Close()


End If

'else
'Response.Write "DB-Verbindung Fehler"
'End If

con.Close

Set con=Nothing
Set rs=Nothing

dim zeit
dim anzeige
zeit = t
anzeige = v   '"['data3',10,20]"

%>

<!DOCTYPE html>
<html>
<head>
<link href="http://localhost/html5_vorlage/Content/styles.bundle.css?v=3.6.12-67" rel="stylesheet">

<SCRIPT language=JavaScript src="http://localhost/html5_vorlage/Scripts/vendor3.bundle.js?v=3.6.12-67"></SCRIPT>
</head>
<body>


<h3>Chartanzeige, alles in ASP verpackt</h3>
<div id="chart1"></div>
<script>

var chart1 = c3.generate({
                    bindto: '#chart1',
                    data: {
                        x: 'x',
                        // xFormat: '%Y-%m-%d %H:%M:%S',
                        xFormat: '%d.%m.%Y %H:%M:%S',
                        columns: [
                            <%= zeit %>,
                            ['data1', 30, 200, 100, 400, 150, 250],
                            <%= anzeige %>
                        ]
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%H:%M:%S' //'%Y.%m.%d %H:%M:%S'
                            }
                        }
                    },
                    zoom: {
                        enabled: true
                    }
                });
</script>

</body>
</html>






