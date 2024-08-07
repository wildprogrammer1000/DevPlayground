package com.wildsoft.projects.shop.project.shop;

import lombok.Data;

@Data
public class CartVO {
  private int cart_id;
  private int id;
  private int product_id;
  private int product_price;
  private int quantity;
  private String created_at;
  private String updated_at;
}
