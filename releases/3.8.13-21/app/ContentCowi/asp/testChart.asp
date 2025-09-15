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
con.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = "& parDbName & "; User Id = sa; Password = webfactory"

Set rs  = Server.CreateObject("ADODB.Recordset")

CommandText= ""
CommandText= CommandText & "EXEC [dbo].[sp_GetLogValuesByDate] '" & parAliasName & "', " & parAnzahl & ", '" & parStart & "', '" & parEnde & "'"  'StorageProcedure ansprechen, eine Art View in einer DB
rs.Open CommandText,con
	
if rs.BOF or rs.EOF then
		Response.Write("Keine Eintraege gefunden")
	rs.Close()
else

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





