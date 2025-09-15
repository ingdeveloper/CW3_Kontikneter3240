<!--#include file="class/jsonObject.class.asp" -->
<%

'Zum Debuggen diese Funktion nehmen
	function aspLog(value)
		response.Write("<script language=javascript>console.log('" & value & "'); </script>")
	end function


set sendJSONarr = new JSONarray
set sendJSONobj = new JSONobject


Dim conn
Dim erg 
erg = "Hallo"

Set con = Server.CreateObject("ADODB.Connection")
con.CommandTimeout = 10
con.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = Fuell3020; User Id = sa; Password = webfactory"

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
CommandText= CommandText & "EXEC [dbo].[sp_GetLogValues] N'Local Minute', 2"   'StorageProcedure ansprechen, eine Art View in einer DB


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

    varErgebnis = ""
    Do While NOT rs.Eof   
    'Response.write(rs("Name"))
    'Response.write Recordset("SECOND_FIELD_NAME")
    'Response.write Recordset("THIRD_FIELD_NAME")
    'Response.write "<br>"    
    varErgebnis = varErgebnis & rs("LoggingTime") & ";" & rs("LoggingValue") & ";"
    
    		set JSONobjZeile = new JSONobject    'neu anlegen, dh. auch löschen
			set JSONarrZeile = new JSONarray
			'JSONobjZeile.Add "t",rs("LoggingTime")
			'JSONobjZeile.Add "v",rs("LoggingValue")
			
			'sendJSONarr.Push(11)
        'aspLog("1")
    rs.MoveNext     
    Loop
    varErgebnis = Left(varErgebnis, Len(varErgebnis) - 1)  'letzte Komma abschneiden
    varErgebnis = varErgebnis & ""
    'Response.Write(varErgebnis)
    'Response.Write(rs.RecordCount & "<br>")
	'Response.Write(rs(1) & "<br>")  'rs bedeutet, lese ROW
	
    'Response.Write(sendJSONarr)
    set sendJSONarr = new JSONarray
    sendJSONarr.Push("11")
    sendJSONarr.Push("12")


    sendJSONobj.Add "LKW", sendJSONarr  'globales Objekt

	dim jsonString2

	jsonString2 = sendJSONobj.Serialize()

	'Response.Write(sendJSONarr)
    
    
    
    
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





