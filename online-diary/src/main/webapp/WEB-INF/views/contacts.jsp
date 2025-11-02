<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Контакты</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/styles.css">
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; }
        table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
        th, td { border: 1px solid #ddd; padding: 0.75rem; text-align: left; }
        th { background-color: #f5f5f5; }
        .actions { display: flex; gap: 0.5rem; }
        .btn { padding: 0.4rem 0.8rem; border-radius: 4px; border: none; cursor: pointer; text-decoration: none; }
        .btn-primary { background-color: #007bff; color: #fff; }
        .btn-secondary { background-color: #6c757d; color: #fff; }
        .btn-danger { background-color: #dc3545; color: #fff; }
        .flash { padding: 0.75rem 1rem; border-radius: 4px; margin-bottom: 1rem; }
        .flash-success { background-color: #d1e7dd; color: #0f5132; }
        .empty { margin-top: 1.5rem; color: #6c757d; font-style: italic; }
    </style>
</head>
<body>
<h1>Список контактов</h1>
<a href="<c:url value='/contacts/new'/>" class="btn btn-primary">Добавить контакт</a>
<c:if test="${not empty successMessage}">
    <div class="flash flash-success">${successMessage}</div>
</c:if>
<c:choose>
    <c:when test="${not empty contacts}">
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>E-mail</th>
                <th>Телефон</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach items="${contacts}" var="contact" varStatus="status">
                <tr>
                    <td>${status.index + 1}</td>
                    <td>${contact.firstName}</td>
                    <td>${contact.lastName}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td>
                        <div class="actions">
                            <a class="btn btn-secondary" href="<c:url value='/contacts/${contact.id}/edit'/>">Редактировать</a>
                            <form action="<c:url value='/contacts/${contact.id}/delete'/>" method="post" onsubmit="return confirm('Удалить контакт ${contact.firstName} ${contact.lastName}?');">
                                <button type="submit" class="btn btn-danger">Удалить</button>
                            </form>
                        </div>
                    </td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </c:when>
    <c:otherwise>
        <p class="empty">Контактов пока нет. Добавьте первый!</p>
    </c:otherwise>
</c:choose>
</body>
</html>