package com.wildsoft.projects.shop.project.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class UserServiceImpl implements UserService {

  @Autowired
  private UserDao dao;

  @Override
  public List<UserVO> getUserList(UserVO vo) {
    return dao.getUserList(vo);
  }

  @Override
  public UserVO getUser(UserVO vo) {
    return dao.getUser(vo);
  }
  
}
