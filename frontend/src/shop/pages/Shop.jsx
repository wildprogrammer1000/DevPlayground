import { Button, Container } from "@mui/material";
import URL from "constants/url";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "utils/context";

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
    </Container>
  );
};

export default Shop;
