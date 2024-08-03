package com.wildsoft.ecommerce.shop.project.user;

import java.util.List;

public interface UserService {
  List<UserVO> getUserList(UserVO vo);
  UserVO getUser(UserVO vo);
}
