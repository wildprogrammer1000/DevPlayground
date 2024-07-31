<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="path" value="${pageContext.request.contextPath}" scope="session"/>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>유저목록</title>
</head>
<body>
<div>
    <h2>유저목록</h2>
    <table>
        <tr>
            <th>id</th>
            <th>platform</th>
            <th>role</th>
            <th>email</th>
            <th>nickname</th>
            <th>create_time</th>
        </tr>
        <c:forEach var="m" items="${li}">
            <tr>
                <td>${m.id}</td>
                <td>${m.platform}</td>
                <td>${m.role}</td>
                <td>${m.email}</td>
                <td><a href="/mypage?id=${m.id}">${m.nickname}</a></td>
                <td>${m.create_time}</td>
            </tr>
        </c:forEach>
    </table>
</div>
</body>
</html>
