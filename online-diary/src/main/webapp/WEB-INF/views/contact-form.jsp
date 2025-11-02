<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title><c:out value='${title}'/></title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; }
        .form-container { max-width: 480px; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-weight: bold; margin-bottom: 0.3rem; }
        input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
        .error { color: #dc3545; font-size: 0.9rem; margin-top: 0.2rem; }
        .actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .btn { padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; }
        .btn-primary { background-color: #198754; color: #fff; }
        .btn-secondary { background-color: #6c757d; color: #fff; }
    </style>
</head>
<body>
<h1><c:out value='${title}'/></h1>
<div class="form-container">
    <form:errors path="*" cssClass="error" element="div"/>
    <form:form modelAttribute="contact" method="post">
        <form:hidden path="id"/>
        <div class="form-group">
            <label for="firstName">Имя</label>
            <form:input path="firstName" id="firstName"/>
            <form:errors path="firstName" cssClass="error"/>
        </div>
        <div class="form-group">
            <label for="lastName">Фамилия</label>
            <form:input path="lastName" id="lastName"/>
            <form:errors path="lastName" cssClass="error"/>
        </div>
        <div class="form-group">
            <label for="email">E-mail</label>
            <form:input path="email" id="email"/>
            <form:errors path="email" cssClass="error"/>
        </div>
        <div class="form-group">
            <label for="phone">Телефон</label>
            <form:input path="phone" id="phone"/>
            <form:errors path="phone" cssClass="error"/>
        </div>
        <div class="actions">
            <button type="submit" class="btn btn-primary">Сохранить</button>
            <a class="btn btn-secondary" href="<c:url value='/contacts'/>">Отмена</a>
        </div>
    </form:form>
</div>
</body>
</html>