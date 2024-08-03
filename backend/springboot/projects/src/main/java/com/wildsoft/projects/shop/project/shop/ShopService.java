package com.wildsoft.projects.shop.project.shop;

import java.util.List;

public interface ShopService {
  List<ProductVO> getProductList(ProductVO vo);
  void insertProductAndImage(ProductVO vo);
}
