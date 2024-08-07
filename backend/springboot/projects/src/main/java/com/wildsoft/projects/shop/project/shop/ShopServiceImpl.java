package com.wildsoft.projects.shop.project.shop;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class ShopServiceImpl implements ShopService {

  @Autowired
  private ShopDao dao;

  @Override
  public List<ProductVO> getProductList(ProductVO vo) {
    return dao.getProductList(vo);
  }

  @Override
  public ProductVO getProductOne(ProductVO vo) {
    return dao.getProductOne(vo);
  }

  @Override
  public void insertProduct(ProductVO vo) {
    dao.insertProduct(vo);
  }

  @Override
  public void updateProduct(ProductVO vo) {
    dao.updateProduct(vo);
  }

  @Override
  public void deleteProduct(ProductVO vo) {
    dao.deleteProduct(vo);
  }

  @Override
  public List<CartVO> getCartList(CartVO vo) {
    return dao.getCartList(vo);
  }

  @Override
  public CartVO getCartOne(CartVO vo) {
    return dao.getCartOne(vo);
  }

  @Override
  public List<CartVO> getCartsByIdAndProductId(CartVO vo) {
    return dao.getCartsByIdAndProductId(vo);
  }

  @Override
  public void insertCart(CartVO vo) {
    dao.insertCart(vo);
  }

  @Override
  public void updateCart(CartVO vo) {
    dao.updateCart(vo);
  }

  @Override
  public void deleteCart(CartVO vo) {
    dao.deleteCart(vo);
  }

  @Override
  public void deleteAllCart(CartVO vo) {
    dao.deleteAllCart(vo);
  }

}
