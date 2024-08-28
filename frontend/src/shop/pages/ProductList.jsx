import { useEffect, useState } from "react";
import { Box, Pagination } from "@mui/material";
import { requestFetch } from "api/fetch";
import CODE from "constants/code";
import URL from "constants/url";

const pageSize = 3;

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    pageIndex: 1,
    search_type: "",
    search_value: "",
  });
  const [totalCount, setTotalCount] = useState(0);

  const getProductList = () => {
    const startIndex = pageSize * searchOptions.pageIndex - (pageSize - 1);
    const payload = {
      start: startIndex,
      end: startIndex + (pageSize - 1),
    };
    const requestOptions = {
      method: "get",
      params: payload,
    };
    requestFetch(URL.LIST_PRODUCT, requestOptions, (res) => {
      if (res.status === CODE.SUCCESS) {
        const { total_count, product_list } = res.data;
        setTotalCount(total_count);
        setProductList(product_list);
      }
    });
  };

  const handlePageChange = (_, page) => {
    setSearchOptions((state) => ({ ...state, pageIndex: page }));
  };

  useEffect(() => {
    getProductList();
  }, [searchOptions.pageIndex]);

  return (
    <div>
      {productList.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {productList.map((product) => (
            <Box
              key={`product_${product.product_id}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                border: "1px solid #ccc",
              }}
            >
              <Box>{product.product_name}</Box>
              <Box>₩{product.product_price}</Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>등록된 상품이 없어요.</Box>
      )}
      <Pagination
        sx={{ display: "flex", justifyContent: "center" }}
        page={searchOptions.pageIndex}
        count={totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
