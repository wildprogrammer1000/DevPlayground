import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import URL from "../../constants/url";
import { getSessionItem } from "../../utils/storage";
import { requestPost } from "../../api/fetch";

const BoardEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState({ title: "", content: "" });
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
      <form onSubmit={handleSubmit}>
        <input
          value={post.title}
          onChange={(e) =>
            setPost((state) => ({ ...state, title: e.target.value }))
          }
        ></input>
        <textarea
          value={post.content}
          onChange={(e) =>
            setPost((state) => ({ ...state, content: e.target.value }))
          }
        ></textarea>
        <button>저장</button>
      </form>
    </div>
  );
};

export default BoardEdit;
