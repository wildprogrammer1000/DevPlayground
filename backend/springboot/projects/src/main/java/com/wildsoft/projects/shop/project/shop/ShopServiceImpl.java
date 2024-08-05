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

}
