package com.wildsoft.projects.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.wildsoft.projects.shop.project.shop.ProductVO;
import com.wildsoft.projects.shop.project.shop.ShopService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api")
public class ShopController {

  @Autowired
  private ShopService service;

  @GetMapping("/productList")
  public List<ProductVO> productList(ProductVO vo) {
    return service.getProductList(vo);
  }

  @GetMapping("/productOne")
  public ProductVO productOne(ProductVO vo) {
    return service.getProductOne(vo);
  }

  @PostMapping("/insertProduct")
  public ResponseEntity<String> insertProduct(ProductVO vo) {
    service.insertProduct(vo);
    return ResponseEntity.ok("insert successfully");
  }

  @PostMapping("/updateProduct")
  public String updateProduct(ProductVO vo) {
    service.updateProduct(vo);
    return "update Successfully";
  }

  @PostMapping("/deleteProduct")
  public String deleteProduct(ProductVO vo) {
    service.deleteProduct(vo);
    return "delete Successfully";
  }

}
