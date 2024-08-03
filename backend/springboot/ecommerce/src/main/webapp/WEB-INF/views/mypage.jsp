<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

  <%@taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
    <c:set var="path" value="${pageContext.request.contextPath }" scope="session" />

    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <title>mypage</title>
    </head>

    <body>
      <h2>마이페이지</h2>
      <form action="/userUpdate">
        <table>
          <tr>
            <th>id</th>
            <td><input type="text" name="id" value="${m.id}"></td>
          </tr>
          <tr>
            <th>platform</th>
            <td><input type="text" name="platform" value="${m.platform}"></td>
          </tr>
          <tr>
            <th>role</th>
            <td><input type="text" name="role" value="${m.role}"></td>
          </tr>
          <tr>
            <th>email</th>
            <td><input type="text" name="email" value="${m.email}"></td>
          </tr>
          <tr>
            <th>nickname</th>
            <td><input type="text" name="nickname" value="${m.nickname}"></td>
          </tr>
          <tr>
            <th>create_time</th>
            <td><input type="text" name="create_time" value="${m.create_time}"></td>
          </tr>
          <tr>
            <td><input type="submit" value="수정"></td>
          </tr>
        </table>
      </form>
    </body>

    </html>