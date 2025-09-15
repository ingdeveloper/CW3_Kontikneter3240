<!--#include file="class/jsonObject.class.asp" -->
<%
' instantiate the class
set JSON2 = New JSONobject
' instantiate the class
'set JSONarr = New JSONarray

' load records from an ADODB.Recordset
dim cn, rs
'set cn = CreateObject("ADODB.Connection")
'cn.CommandTimeout = 10
'cn.Open "Provider=SQLOLEDB; Data Source = .\WEBFACTORY2010; Initial Catalog = Fuell3020; User Id = sa; Password = webfactory"

'set rs = cn.execute("EXEC [dbo].[sp_GetLogValues] N'Local Minute', 2")
' this could also be:
' set rs = CreateObject("ADODB.Recordset")
' rs.Open "SELECT id, nome, valor FROM pedidos ORDER BY id ASC", cn	

'JSON2.LoadRecordset rs
'JSONarr.LoadRecordset rs

'rs.Close
'cn.Close
'set rs = Nothing
'set cn = Nothing
'Response.Write("Hallo")
'Response.Write(JSON2)
'Response.End

'JSON2.Write() 		' outputs: {"data":[{"id":1,"nome":"nome 1","valor":10.99},{"id":2,"nome":"nome 2","valor":19.1}]}
'JSONarr.Write() 	' outputs: [{"id":1,"nome":"nome 1","valor":10.99},{"id":2,"nome":"nome 2","valor":19.1}]

'dim jsonString2

'jsonString2 = JSON2.Serialize()
'Response.Write("Moin")
Dim jsonString
jsonString = "{ ""strings"" : ""valorTexto"", ""numbers"": 123.456, ""arrays"": [1, ""2"", 3.4, [5, 6, [7, 8]]] }"
'JSON2.Parse(jsonString)
'JSON2.Write() ' outputs: '{"strings":"valorTexto","numbers":123.456,"arrays":[1,"2",3.4,[5,6,[7,8]]]}'
Response.Write(jsonString)

%>





