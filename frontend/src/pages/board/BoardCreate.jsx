import { useState } from "react";
import { requestPost } from "../../api/fetch";
import { useNavigate } from "react-router-dom";
import { CATEGORY } from "../../constants/constants";
import URL from "../../constants/url";
const BoardCreate = ({ user }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    category: 0,
  });
  const handleResponse = (res) => {
    switch (res.status) {
      default:
        alert("게시글이 등록되었습니다.");
        navigate(URL.BOARD);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인 ㄱㄱ");
      return;
    }
    requestPost(URL.BOARD_CREATE, { ...inputs }, handleResponse);
  };
  return (
    <div>
      <h2>글쓰기</h2>
      <hr />
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 400,
          padding: 8,
          margin: "0 auto",
        }}
        onSubmit={handleSubmit}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1, height: 32, padding: 8 }}
            value={inputs.title}
            placeholder="제목을 입력해주세요."
            onChange={(e) =>
              setInputs((state) => ({ ...state, title: e.target.value }))
            }
          ></input>
          <select
            style={{ padding: 8 }}
            onChange={(e) =>
              setInputs((state) => ({
                ...state,
                category: Number(e.target.value),
              }))
            }
          >
            {Object.keys(CATEGORY).map((category) => (
              <option value={category} key={CATEGORY[category]}>
                {CATEGORY[category]}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="내용을 입력해주세요."
          value={inputs.content}
          style={{ minHeight: 100, padding: 8 }}
          onChange={(e) =>
            setInputs((state) => ({ ...state, content: e.target.value }))
          }
        ></textarea>
        <button style={{ height: 32 }}>등록</button>
      </form>
    </div>
  );
};
export default BoardCreate;
