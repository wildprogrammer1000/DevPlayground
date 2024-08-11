-- 상품 정보 테이블 (추후 이미지 추가 예정)
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,         -- 상품 ID (기본키)
    product_name VARCHAR(255) NOT NULL,                -- 상품 이름
    product_description TEXT,                          -- 설명 및 이미지 URL을 포함
    product_price DECIMAL(10, 2) NOT NULL,             -- 가격
    stock_quantity INT NOT NULL,                       -- 재고 수량
    category VARCHAR(100),                             -- 카테고리
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- 생성 일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 수정 일시
);

-- 장바구니 테이블
CREATE TABLE IF NOT EXISTS carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,           -- 장바구니 ID (기본키)
    id INT NOT NULL,                                  -- 사용자 ID (외래키)
    product_id INT NOT NULL,                          -- 상품 ID (외래키)
    product_price DECIMAL(10, 2) NOT NULL,            -- 가격
    quantity INT NOT NULL,                            -- 수량
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 생성 일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정 일시
    FOREIGN KEY (id) REFERENCES users(id),            -- 사용자 외래키
    FOREIGN KEY (product_id) REFERENCES products(product_id) -- 상품 외래키
);

-- 고객 정보 테이블
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,       -- 고객 ID (기본키)
    id INT UNIQUE,                                   -- 사용자 ID (외래키)
    name VARCHAR(255) NOT NULL,                      -- 고객명
    phone VARCHAR(20),                              -- 전화번호
    address TEXT,                                   -- 주소
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성 일시
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정 일시
    FOREIGN KEY (id) REFERENCES users(id) -- 사용자 외래키
);