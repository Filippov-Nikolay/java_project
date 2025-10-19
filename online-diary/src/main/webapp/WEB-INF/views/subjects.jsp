<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
	<head>
	    <title>Предметы</title>
	    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
	</head>
	<body>
	    <h1>Проверка JDBC</h1>
	
	    <%
	        if (Boolean.TRUE.equals(request.getAttribute("dbOk"))) {
	    %>
	        <p>Соединение установлено!</p>
	    <%
	        } else {
	    %>
	        <p>Нет соединения!(</p>
	    <%
	            Object err = request.getAttribute("dbError");
	            if (err != null) {
	    %>
	        <pre><%= err %></pre>
	    <%
	            }
	        }
	    %>
	
	    <p><a href="${pageContext.request.contextPath}/">На главную</a></p>
	</body>
</html>
