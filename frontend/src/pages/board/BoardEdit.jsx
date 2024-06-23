import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionItem } from "../../utils/storage";
import { requestPost } from "../../api/fetch";
import { CATEGORY } from "../../constants/constants";
import URL from "../../constants/url";
const BoardEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState({ title: "", content: "", category: 0 });
  const handleResponse = (res) => {
    switch (res.status) {
      default:
        alert("게시글이 수정되었습니다.");
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
    requestPost(URL.BOARD_EDIT, { ...post, ...session }, handleResponse);
  };

  useEffect(() => {
    if (!location.state || !location.state.post) {
      alert("비정상적인 접근입니다.");
      navigate(URL.BOARD);
      return;
    }
    setPost(location.state.post);
  }, []);

  return (
    <div>
      <div>게시글 수정</div>
      <hr />
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 400,
          padding: 8,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1, height: 32, padding: 8 }}
            value={post.title}
            placeholder="제목을 입력해주세요."
            onChange={(e) =>
              setPost((state) => ({ ...state, title: e.target.value }))
            }
          ></input>
          <select
            style={{ padding: 8 }}
            onChange={(e) =>
              setPost((state) => ({
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
          value={post.content}
          style={{ minHeight: 100, padding: 8 }}
          onChange={(e) =>
            setPost((state) => ({ ...state, content: e.target.value }))
          }
        ></textarea>
        <button style={{ height: 32 }}>저장</button>
        <button
          type="button"
          onClick={() =>
            navigate(URL.BOARD_DETAIL, { state: { post_id: post.id } })
          }
        >
          목록
        </button>
      </form>
    </div>
  );
};

export default BoardEdit;
