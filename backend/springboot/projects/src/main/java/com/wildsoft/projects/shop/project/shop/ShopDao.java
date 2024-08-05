package com.wildsoft.projects.shop.project.shop;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShopDao {
  List<ProductVO> getProductList(ProductVO vo);
  ProductVO getProductOne(ProductVO vo);
  void insertProduct(ProductVO vo);
  void updateProduct(ProductVO vo);
  void deleteProduct(ProductVO vo);
}
