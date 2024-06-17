import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import URL from "../../constants/url";
import { requestGet, requestPost } from "../../api/fetch";
import CODE from "../../constants/code";
const BoardDetail = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState();

  const getPost = () => {
    console.log("location state: ", location.state);
    if (!location.state) {
      alert("비정상적인 접근입니다.");
      navigate(URL.BOARD);
      return;
    }
    const post_id = location.state.post_id;
    requestGet(URL.BOARD_DETAIL, { post_id }, (res) => {
      console.log("get post response: ", res);
      if (res.status === CODE.SUCCESS) {
        setPost(res.data);
      }
    });
  };
  const deletePost = () => {
    if (window.confirm("게시글을 삭제할까요?")) {
      requestPost(URL.BOARD_DELETE, { post_id: post.id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert("게시글이 삭제되었습니다.");
          navigate(URL.BOARD);
        }
      });
    }
  };
  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      <div>게시글</div>
      {post ? (
        <>
          <div>
            <div>{post.title}</div>
            <div>
              <div>{post.create_time}</div>
              <div>{post.user_nickname}</div>
            </div>
          </div>
          <div>{post.content}</div>
        </>
      ) : (
        <div>게시글 가져오는 중...</div>
      )}
      <button onClick={() => navigate(URL.BOARD)}>목록</button>
      {user && post && user.id === post.user_id && (
        <div>
          <button>수정</button>
          <button onClick={deletePost}>삭제</button>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
