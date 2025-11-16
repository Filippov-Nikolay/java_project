<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход в систему</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
    <script>
        function handleLogin(event) {
            event.preventDefault();
            const resultBox = document.getElementById('login-result');
            resultBox.textContent = '';

            const responses = ['ДА', 'НЕТ', 'ОШИБКА'];
            const response = responses[Math.floor(Math.random() * responses.length)];

            if (response === 'ДА') {
                resultBox.className = 'success';
                resultBox.textContent = 'Сервер ответил ДА. Выполняется переход в раздел main...';
                setTimeout(() => window.location.href = '${pageContext.request.contextPath}/main', 800);
            } else if (response === 'НЕТ') {
                resultBox.className = 'warning';
                resultBox.textContent = 'Сервер ответил НЕТ. Попробуйте снова.';
            } else {
                resultBox.className = 'error';
                resultBox.textContent = 'Ошибка сервера. Повторите попытку позже.';
            }
        }
    </script>
</head>
<body>
<section class="card">
    <h1>Вход в систему</h1>
    <form onsubmit="handleLogin(event)">
        <label class="field">
            <span>Логин или почта</span>
            <input type="text" name="username" required>
        </label>
        <label class="field">
            <span>Пароль</span>
            <input type="password" name="password" required>
        </label>
        <div class="actions">
            <button type="submit">Войти в систему</button>
            <a class="secondary" href="${pageContext.request.contextPath}/register">Зарегистрироваться</a>
        </div>
    </form>
    <p id="login-result" aria-live="polite"></p>
</section>
</body>
</html>
