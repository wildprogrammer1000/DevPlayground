package com.wildsoft.projects.shop.project.shop;

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

  // 페이지 나누기
  private int rnum;
  private int start;
  private int end;

  // 검색
  private String search_type; 
  private String search_value;
}
