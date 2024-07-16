import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { requestDelete, requestGet, requestPost } from "../../api/fetch";
import URL from "../../constants/url";
import CODE from "../../constants/code";

const BoardDetail = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const getPost = () => {
    if (!location.state) {
      alert("비정상적인 접근입니다.");
      navigate(URL.BOARD);
      return;
    }
    const post_id = location.state.post_id;
    requestGet(URL.BOARD_DETAIL, { post_id }, (res) => {
      if (res.status === CODE.SUCCESS) {
        const post = res.data;
        post.content = post.content.replaceAll("\n", "</br>");
        setPost(post);
        getComment();
        getLikes();
      }
    });
  };

  const editPost = () => navigate(URL.BOARD_EDIT, { state: { post } });

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

  const onSuccess = (res) => {
    if (res.status === CODE.SUCCESS) {
      alert("댓글이 추가되었습니다.");
      getComment();
      setComment("");
    }
  };

  const getComment = () => {
    requestGet(
      URL.BOARD_COMMENT,
      { post_id: location.state.post_id },
      (res) => {
        if (res.status === CODE.SUCCESS) {
          const { comments } = res.data;
          setComments(comments);
        }
      }
    );
  };
  const getLikes = () => {
    requestGet(URL.BOARD_LIKE, { post_id: location.state.post_id }, (res) => {
      if (res.status === CODE.SUCCESS) {
        const { likes } = res.data;
        setLikes(likes);
      }
    });
  };
  const addComment = (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    requestPost(
      URL.BOARD_COMMENT,
      {
        post_id: post.id,
        user_id: user.id,
        content: comment,
      },
      onSuccess
    );
  };
  const toggleLike = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    requestPost(
      URL.BOARD_LIKE,
      { user_id: user.id, post_id: post.id },
      (res) => {
        if (res.status === CODE.SUCCESS) getLikes();
      }
    );
  };
  const deleteComment = (comment_id) => {
    if (window.confirm("이 댓글을 삭제할까요?")) {
      requestDelete(URL.BOARD_COMMENT, { comment_id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert("댓글이 삭제되었습니다.");
          getComment();
        }
      });
    }
  };
  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <h2>게시글</h2>
      <hr />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 8 }}>
        {post ? (
          <div
            style={{
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 12, textAlign: "right", color: "#333" }}>
              {dayjs(post.create_time).format("YYYY-MM-DD HH:mm")}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
              }}
            >
              <div>제목: {post.title}</div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: 8 }}>
              작성자: {post.nickname}
            </div>
            <div
              style={{ padding: 8, border: "2px solid #000" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        ) : (
          <div>게시글 가져오는 중...</div>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            marginBottom: 16,
          }}
        >
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 24,
              border: "2px solid #999",
            }}
            onClick={toggleLike}
          >
            {user && likes.find((like) => like.user_id === user.id) ? "♥" : "♡"}
          </button>

          <div>{likes.length}</div>
        </div>
        <hr />
        <div style={{ marginBottom: 8 }}>댓글 수 0</div>
        <form onSubmit={addComment} style={{ marginBottom: 8 }}>
          <input
            type="text"
            value={comment}
            placeholder="댓글을 입력해주세요"
            onChange={(e) => setComment(e.target.value)}
          ></input>
          <button>등록</button>
        </form>
        <div>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment, index) => (
                <li
                  key={`comment_${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "2px solid #ccc",
                    padding: 8,
                  }}
                >
                  <div>
                    <div>
                      {comment.nickname} /
                      {dayjs(comment.create_time).format("YYYY-MM-DD HH:mm")}
                    </div>
                    <div>{comment.content}</div>
                  </div>
                  {user && user.id === comment.user_id && (
                    <button onClick={() => deleteComment(comment.id)}>
                      삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div>댓글이 없습니다.</div>
          )}
        </div>
        <hr />
        <button onClick={() => navigate(URL.BOARD)}>목록</button>
        {user && post && user.id === post.user_id && (
          <div>
            <button onClick={editPost}>수정</button>
            <button onClick={deletePost}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
