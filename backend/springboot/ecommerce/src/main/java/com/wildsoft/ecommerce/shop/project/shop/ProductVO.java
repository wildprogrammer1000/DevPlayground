package com.wildsoft.ecommerce.shop.project.shop;

import lombok.Data;

@Data
public class ProductVO {
  private int product_id;
  // private String product_image_urls;
  private String product_name;
  private String product_description;
  private int product_price;
  private int stock_quantity;
  private String category;
  private String created_at;
  private String updated_at;
}
