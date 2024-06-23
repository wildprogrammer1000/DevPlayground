import { Link } from "react-router-dom";
import URL from "../../constants/url";

const Admin = () => {
  return (
    <div>
      <Link
        style={{ border: "2px solid #000", padding: 8 }}
        to={URL.ADMIN_MANAGE_WAITING}
      >
        가입 신청 관리
      </Link>
    </div>
  );
};

export default Admin;
