package com.wildsoft.ecommerce.project.shop;

import lombok.Data;

@Data
public class ProductVO {
  private int product_id;
  private int product_imgage_id;
  private String product_name;
  private String product_description;
  private int product_price;
  private int stock_quantity;
  private String category;
  private String product_image_url;
  private String is_primary;
  private String created_at;
  private String updated_at;
}
