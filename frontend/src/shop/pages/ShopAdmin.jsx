import { Button, Container, Dialog } from "@mui/material";
import { useState } from "react";
import ProductInsert from "./ProductInsert";

const ShopAdmin = () => {
  const [popup, setPopup] = useState({
    insert_product: false,
  });
  return (
    <Container>
      <Button
        variant="contained"
        onClick={() =>
          setPopup((state) => ({ ...state, insert_product: true }))
        }
      >
        상품 등록
      </Button>

      <Dialog open={popup.insert_product} fullScreen>
        <ProductInsert
          close={() =>
            setPopup((state) => ({ ...state, insert_product: false }))
          }
        />
      </Dialog>
    </Container>
  );
};

export default ShopAdmin;
