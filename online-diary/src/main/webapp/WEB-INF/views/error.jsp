<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ошибка</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; }
        .error-card { max-width: 520px; border: 1px solid #f5c2c7; background-color: #f8d7da; color: #842029; padding: 1.5rem; border-radius: 6px; }
        h1 { margin-top: 0; }
        a { color: #842029; text-decoration: underline; }
    </style>
</head>
<body>
<div class="error-card">
    <h1>Произошла ошибка</h1>
    <p><strong>Код:</strong> <c:out value='${status}' default='500'/></p>
    <p><strong>Сообщение:</strong> <c:out value='${message}' default='Неизвестная ошибка.'/></p>
    <p><a href="<c:url value='/contacts'/>">Вернуться к списку контактов</a></p>
</div>
</body>
</html>