package com.wildsoft.ecommerce.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wildsoft.ecommerce.shop.project.user.UserService;
import com.wildsoft.ecommerce.shop.project.user.UserVO;
@RestController
public class StartController {

  @Autowired
  private UserService service;

  @GetMapping("/index")
  public String index() {
      return "index";
  }
  
  @GetMapping("/api/userList")
  public List<UserVO> userList(UserVO vo) {
    return service.getUserList(vo);
  }

  @GetMapping("/api/mypage")
  public UserVO mypage(UserVO vo) {
    return service.getUser(vo);
  }

  @GetMapping("/userUpdate")
  public String userUpdate(UserVO vo) {
      return "redirect:/userList";
  }
  
}
