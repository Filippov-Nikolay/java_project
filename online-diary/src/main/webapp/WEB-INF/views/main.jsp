<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Главный раздел</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
</head>
<body>
<section class="card">
    <h1>Главный раздел</h1>
    <p>Вы попали в основной раздел приложения. Проверки авторизации пока не выполняются.</p>
    <div class="actions">
        <a class="secondary" href="${pageContext.request.contextPath}/login">Вернуться к входу</a>
        <a class="secondary" href="${pageContext.request.contextPath}/register">К регистрации</a>
    </div>
</section>
</body>
</html>
