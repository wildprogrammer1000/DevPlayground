package com.wildsoft.projects.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.wildsoft.projects.shop.project.shop.CartVO;
import com.wildsoft.projects.shop.project.shop.ProductResponseVO;
import com.wildsoft.projects.shop.project.shop.ProductVO;
import com.wildsoft.projects.shop.project.shop.ShopService;
import com.wildsoft.projects.shop.project.shop.UserInfoVO;

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
  @GetMapping("/getProductList")
  public ProductResponseVO getProductList(ProductVO vo) {
    List<ProductVO> product_list = service.getProductList(vo);
    int total_count = service.getProductsCount();
    return new ProductResponseVO(product_list, total_count);
  }

  @GetMapping("/getProduct")
  public ProductVO getProduct(ProductVO vo) {
    return service.getProduct(vo);
  }

  @PostMapping("/insertProduct")
  public ResponseEntity<String> insertProduct(@RequestBody ProductVO vo) {
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
  @GetMapping("/getCartList")
  public List<CartVO> getCartList(CartVO vo) {
    return service.getCartList(vo);
  }

  @GetMapping("/getCart")
  public CartVO getCart(CartVO vo) {
    return service.getCart(vo);
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

  @PostMapping("/order")
  public ResponseEntity<?> order(UserInfoVO vo) {
    UserInfoVO info = service.getUserInfosById(vo);
    if (info != null) {
      return ResponseEntity.ok(info);
    } else {
      return ResponseEntity.ok("추가 정보를 입력해주세요.");
    }
  }

  // 유저 추가 정보 입력
  @PostMapping("/insertUserInfos")
  public ResponseEntity<String> insertUserInfos(@RequestBody UserInfoVO vo) {
    service.insertUserInfos(vo);
    return ResponseEntity.ok("추가 정보 입력이 완료되었습니다.");
  }

}
