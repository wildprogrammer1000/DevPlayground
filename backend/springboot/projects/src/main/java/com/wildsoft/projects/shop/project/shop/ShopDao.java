package com.wildsoft.projects.shop.project.shop;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShopDao {
  // 상품 목록
  List<ProductVO> getProductList(ProductVO vo);
  int getProductsCount();
  ProductVO getProduct(ProductVO vo);
  void insertProduct(ProductVO vo);
  void updateProduct(ProductVO vo);
  void deleteProduct(ProductVO vo);

  // 장바구니
  List<CartVO> getCartList(CartVO vo);
  CartVO getCart(CartVO vo);
  List<CartVO> getCartsByIdAndProductId(CartVO vo);
  void insertCart(CartVO vo);
  void updateCart(CartVO vo);
  void deleteCart(CartVO vo);
  void deleteAllCart(CartVO vo);

  // 유저 추가 정보 입력
  UserInfoVO getUserInfosById(UserInfoVO vo);
  void insertUserInfos(UserInfoVO vo);
  void updateUserInfos(UserInfoVO vo);
}
