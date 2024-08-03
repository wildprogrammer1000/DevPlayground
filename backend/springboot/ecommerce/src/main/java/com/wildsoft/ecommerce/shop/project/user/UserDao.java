package com.wildsoft.ecommerce.shop.project.user;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDao {
  List<UserVO> getUserList(UserVO vo);
  UserVO getUser(UserVO vo);
}
