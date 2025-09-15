<!--#include file="class/jsonObject.class.asp" -->
<%

'################################################################################################################
'Uebergabe von Request-Parametern
parDbName=(unescape(Request("dbName")))
parAliasName=(unescape(Request("alias")))
parAnzahl=(unescape(Request("anzahl")))
parStart=(unescape(Request("start")))
parEnde=(unescape(Request("ende")))
parLine=(unescape(Request("line")))
'################################################################################################################

'Zum String setzen
	function str(text)
		str = chr(34) & text & chr(34)
	end function

Dim conn
Dim erg 
erg = "Hallo"

Set con = Server.CreateObject("ADODB.Connection")
con.CommandTimeout = 10
'cn.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = Fuell3020; User Id = sa; Password = webfactory"
con.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = "& parDbName & "; User Id = sa; Password = webfactory"

'If con.State = 1 Then

'Response.Write "Connected OK <br>"
'strSQL = "SELECT TOP 10 * FROM Signals"
'conn.Execute (strSql)

'Response.Write "DB-Verbindung Fehler"
'Response.Write erg


Set rs  = Server.CreateObject("ADODB.Recordset")

CommandText= ""
'CommandText= CommandText & "SELECT TOP 10 * FROM signals"
'CommandText= CommandText & "SELECT TOP 10000 * FROM L_A8E73B7B8E494EB6B8B7EFEFC7034CA5 order by LoggingTime DESC"  'eine Kurve fest ausgesucht
CommandText= CommandText & "EXEC [dbo].[sp_GetLogValuesByDate] '" & parAliasName & "', " & parAnzahl & ", '" & parStart & "', '" & parEnde & "'"  'StorageProcedure ansprechen, eine Art View in einer DB


'Response.Write(CommandText):Response.End

'rs.Open CommandText,con,0,1
rs.Open CommandText,con
	
if rs.BOF or rs.EOF then
		Response.Write("Keine Eintraege gefunden")
	rs.Close()
else
	'Do
	'	If rs.EOF Then 
    '        Exit
    '    End If 
	'	if trim(rs("Name")) > 0 then			 
	'		varErgebnis = varErgebnis & rs("Name")
	'	end if
	'	rs.MoveNext
	'Loop
	'Response.Write((rs("Name")))

    varErgebnis = "{" & str("d") & ":" & "["
    dim rows
    dim v
    rows = "[" & str("x") & "," & str(parLine) & "],"
    Do While NOT rs.Eof   
        rows = rows & "[" & str(rs("LoggingTime"))  & "," & rs("LoggingValue") & "],"
    
        rs.MoveNext     
    Loop

    'rows = Left(rows, Len(rows) - 1)  'letzte Komma abschneiden
    'rows = rows & "]"

    
    'frame = frame & """t"":" & t & "," & """v"":" & v & "}"
    varErgebnis = varErgebnis & rows 
    varErgebnis = Left(varErgebnis, Len(varErgebnis) - 1)  'letzte Komma abschneiden
    varErgebnis = varErgebnis & "]}"
        
    
    'varErgebnis = "{" & chr(34) & "name"  & chr(34) &  ":" & "[1,2,3,4]" & "}"
    'varErgebnis = "{"  & chr(34) & "d"  & chr(34) &  ":" & "[" & "[5,6,7],[8,9,10]" & "]}"
    
    Response.Write(varErgebnis)
    
    'Response.Write(rs.RecordCount & "<br>")
	'Response.Write(rs(1) & "<br>")  'rs bedeutet, lese ROW
	
    'Response.Write(sendJSONarr)
    'set sendJSONarr = new JSONarray
    'set sendJSONobj = new JSONobject
    'set JSONobjIntern = new JSONobject

    'JSONobjIntern.Add "aenderung", "21"
	'JSONobjIntern.Add "aliasName", "22"

    'JSONarrZeile.Push(JSONobjIntern)
    
    'sendJSONarr.Push("11")
    'sendJSONarr.Push("12")

    'JSONobjZeile.Add "aenderungen", JSONarrZeile '"fdsfds"

    'sendJSONobj.Add "d", JSONobjZeile  'globales Objekt

	'dim jsonString2

	'jsonString2 = sendJSONobj.Serialize()

	'Response.Write(jsonString2)
    
    
    
    
    Response.End
    rs.Close()


End If

'else
'Response.Write "DB-Verbindung Fehler"
'End If

con.Close

Set con=Nothing
Set rs=Nothing

%>





