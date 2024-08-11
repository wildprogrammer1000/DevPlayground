package com.wildsoft.projects.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.wildsoft.projects.shop.project.shop.CartVO;
import com.wildsoft.projects.shop.project.shop.ProductVO;
import com.wildsoft.projects.shop.project.shop.ShopService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class ShopController {

  @Autowired
  private ShopService service;

  // 상품
  @GetMapping("/productList")
  public List<ProductVO> productList(ProductVO vo) {
    return service.getProductList(vo);
  }

  @GetMapping("/productOne")
  public ProductVO productOne(ProductVO vo) {
    return service.getProductOne(vo);
  }

  @PostMapping("/insertProduct")
  public ResponseEntity<String> insertProduct(@RequestBody ProductVO vo) {
    System.out.println(vo);
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

  // 장바구니
  @GetMapping("/cartList")
  public List<CartVO> cartList(CartVO vo) {
    return service.getCartList(vo);
  }

  @GetMapping("/cartOne")
  public CartVO cartOne(CartVO vo) {
    return service.getCartOne(vo);
  }

  @PostMapping("/insertCart")
  public ResponseEntity<String> insertCart(CartVO vo) {
    List<CartVO> existingCarts = service.getCartsByIdAndProductId(vo);
    if (existingCarts.isEmpty()) {
      service.insertCart(vo);
      return ResponseEntity.ok("장바구니에 추가되었습니다.");
    } else {
      service.updateCart(vo);
      return ResponseEntity.ok("장바구니에 이미 제품이 있어 수량만큼 추가되었습니다.");
    }
  }

  @PostMapping("/deleteCart")
  public String deleteCart(CartVO vo) {
    service.deleteCart(vo);
    return "해당 상품을 장바구니에서 삭제하였습니다.";
  }

  @PostMapping("/deleteAllCart")
  public String deleteAllCart(CartVO vo) {
    service.deleteAllCart(vo);
    return "장바구니의 상품을 전체 삭제하였습니다.";
  }

}
