package com.wildsoft.projects.shop.project.user;

import lombok.Data;

@Data
public class UserVO {
  private String id;
  private String platform;
  private String role;
  private String email;
  private String nickname;
  private String create_time;
}
