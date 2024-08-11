import { Button, MenuItem, Select, TextField } from "@mui/material";
import { requestFetch } from "api/fetch";
import CODE from "constants/code";
import { SHOP_CATEGORY } from "constants/constants";
import { useState } from "react";

const ProductInsert = ({ close }) => {
  const [inputs, setInputs] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    stock_quantity: "",
    category: -1,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.category === -1) return alert("카테고리를 선택해주세요.");

    const requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: inputs,
    };
    requestFetch(URL.INSERT_PRODUCT, requestOptions, (res) => {
      if (res.status === CODE.SUCCESS) {
        alert("상품이 등록되었습니다.");
        close();
      }
    });
  };
  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit}
    >
      <Button variant="contained" onClick={close}>
        닫기
      </Button>
      <TextField
        placeholder="상품 이름"
        value={inputs.product_name}
        onChange={(e) =>
          setInputs((state) => ({ ...state, product_name: e.target.value }))
        }
      />
      <Select
        value={inputs.category}
        onChange={(e) =>
          setInputs((state) => ({ ...state, category: Number(e.target.value) }))
        }
      >
        <MenuItem value={-1}>카테고리를 선택하세요</MenuItem>
        {Object.keys(SHOP_CATEGORY).map((key, index) => (
          <MenuItem key={`category_${index}`} value={key}>
            {SHOP_CATEGORY[key]}
          </MenuItem>
        ))}
      </Select>
      <TextField
        minRows={3}
        multiline
        placeholder="상품 설명"
        value={inputs.product_description}
        onChange={(e) =>
          setInputs((state) => ({
            ...state,
            product_description: e.target.value,
          }))
        }
      />
      <TextField
        placeholder="상품 가격"
        type="number"
        value={String(inputs.product_price)}
        onChange={(e) =>
          setInputs((state) => ({
            ...state,
            product_price: Number(e.target.value),
          }))
        }
      />
      <TextField
        placeholder="재고 수량"
        type="number"
        value={String(inputs.stock_quantity)}
        onChange={(e) =>
          setInputs((state) => ({
            ...state,
            stock_quantity: Number(e.target.value),
          }))
        }
      />

      <Button variant="contained" type="submit">
        추가
      </Button>
    </form>
  );
};

export default ProductInsert;
