package com.wildsoft.projects.shop.project.shop;

import lombok.Data;

@Data
public class OrderVO {
  private int order_id;
  private int id;
  private int product_id;
  private int quantity;
  private int total_price;
  private int shipping_fee;
  private String status;
  private String shipping_address;
  private String payment_method;
  private String created_at;
  private String updated_at;
}
