<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
	<head>
	    <title>Online Diary – Index</title>
	    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
	</head>
	<body>
		<%! 
		    private int visitCounter = 0; 
		%>
		
		<%
		    visitCounter++;
		    java.time.LocalDateTime now = java.time.LocalDateTime.now();
		%>
		
		<h1>Онлайн-дневник</h1>
		<p>Текущее время: <%= now %></p>
		<p>Посещений этой страницy за запуск: <%= visitCounter %></p>
		
		<p>
			<a href="${pageContext.request.contextPath}/subjects">Перейти к предметам</a>
		</p>
	</body>
</html>
