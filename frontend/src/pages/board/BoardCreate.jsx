import { useState } from "react";
import { requestPost } from "../../api/fetch";
import { getSessionItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import URL from "../../constants/url";

const BoardCreate = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
  });
  const handleResponse = (res) => {
    switch (res.status) {
      // case ""
      default:
        // 성공
        alert("게시글이 등록되었습니다.");
        navigate(URL.BOARD);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const session = getSessionItem("userTokens");
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }
    requestPost(URL.BOARD_CREATE, { ...inputs, ...session }, handleResponse);
  };
  return (
    <div>
      <div>글쓰기</div>
      <form onSubmit={handleSubmit}>
        <input
          value={inputs.title}
          onChange={(e) =>
            setInputs((state) => ({ ...state, title: e.target.value }))
          }
        ></input>
        <textarea
          value={inputs.content}
          onChange={(e) =>
            setInputs((state) => ({ ...state, content: e.target.value }))
          }
        ></textarea>
        <button>등록</button>
      </form>
    </div>
  );
};
export default BoardCreate;
