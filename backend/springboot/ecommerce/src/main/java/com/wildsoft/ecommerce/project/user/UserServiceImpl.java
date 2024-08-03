package com.wildsoft.ecommerce.project.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
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
