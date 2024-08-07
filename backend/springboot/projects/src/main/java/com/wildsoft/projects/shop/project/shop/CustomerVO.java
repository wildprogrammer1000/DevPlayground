package com.wildsoft.projects.shop.project.shop;

import lombok.Data;

@Data
public class CustomerVO {
  private int customer_id;
  private int id;
  private String name;
  private String phone;
  private String address;
  private String created_at;
  private String updated_at;
}
