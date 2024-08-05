package com.wildsoft.projects.shop.project.shop;

import java.util.List;

public interface ShopService {
  List<ProductVO> getProductList(ProductVO vo);
  ProductVO getProductOne(ProductVO vo);
  void insertProduct(ProductVO vo);
  void updateProduct(ProductVO vo);
  void deleteProduct(ProductVO vo);
}
