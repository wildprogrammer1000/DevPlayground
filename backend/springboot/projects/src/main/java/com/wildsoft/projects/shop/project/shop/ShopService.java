package com.wildsoft.projects.shop.project.shop;

import java.util.List;

public interface ShopService {
  List<ProductVO> getProductList(ProductVO vo);
  ProductVO getProductOne(ProductVO vo);
  void insertProduct(ProductVO vo);
  void updateProduct(ProductVO vo);
  void deleteProduct(ProductVO vo);

  List<CartVO> getCartList(CartVO vo);
  CartVO getCartOne(CartVO vo);
  List<CartVO> getCartsByIdAndProductId(CartVO vo);
  void insertCart(CartVO vo);
  void updateCart(CartVO vo);
  void deleteCart(CartVO vo);
  void deleteAllCart(CartVO vo);
}
