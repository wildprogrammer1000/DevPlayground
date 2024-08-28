import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { Context } from "utils/context";
import ProductList from "./ProductList";
import URL from "constants/url";

const Shop = () => {
  const context = useContext(Context);
  const [user] = context.user;

  return (
    <Container>
      {user && user.role === "admin" && (
        <NavLink to={URL.SHOP_ADMIN}>
          <Button variant="contained">관리자 콘솔</Button>
        </NavLink>
      )}
      <ProductList />
    </Container>
  );
};

export default Shop;
