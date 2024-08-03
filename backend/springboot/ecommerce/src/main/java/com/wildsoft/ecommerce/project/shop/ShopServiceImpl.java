package com.wildsoft.ecommerce.project.shop;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
  @Transactional
  public void insertProductAndImage(ProductVO vo) {
    dao.insertProduct(vo);
    dao.insertProductImage(vo);
  }

}
