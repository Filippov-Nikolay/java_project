<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Регистрация</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
    <script>
        function handleRegister(event) {
            event.preventDefault();
            const resultBox = document.getElementById('register-result');
            resultBox.textContent = '';

            const passwords = document.getElementById('password');
            const confirm = document.getElementById('confirm');
            if (passwords.value !== confirm.value) {
                resultBox.className = 'error';
                resultBox.textContent = 'Пароли не совпадают. Исправьте и попробуйте снова.';
                return;
            }

            resultBox.className = 'success';
            resultBox.textContent = 'Данные отправлены (демо). Аккаунт зарегистрирован.';
        }
    </script>
</head>
<body>
<section class="card">
    <h1>Регистрация</h1>
    <form onsubmit="handleRegister(event)">
        <label class="field">
            <span>Логин</span>
            <input type="text" name="username" required>
        </label>
        <label class="field">
            <span>Пароль</span>
            <input type="password" id="password" name="password" required>
        </label>
        <label class="field">
            <span>Подтверждение пароля</span>
            <input type="password" id="confirm" name="confirm" required>
        </label>
        <div class="actions">
            <button type="submit">Зарегистрироваться</button>
            <a class="secondary" href="${pageContext.request.contextPath}/login">Вернуться к входу</a>
        </div>
    </form>
    <p id="register-result" aria-live="polite"></p>
</section>
</body>
</html>
