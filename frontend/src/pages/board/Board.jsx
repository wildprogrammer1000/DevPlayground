import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../../api/fetch";
import { CATEGORY } from "../../constants/constants";
import URL from "../../constants/url";
import dayjs from "dayjs";

const Board = ({ user }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchOptions, setSearchOptions] = useState({
    category: -1,
    page: 0,
    rowsPerPage: 5,
  });

  const getPosts = () => {
    requestGet(URL.BOARD, searchOptions, (res) => {
      const { board, totalPage } = res.data;
      setBoard(board);
      setTotalPage(totalPage);
    });
  };
  const createPost = () => {
    if (!user) return alert("로그인이 필요합니다.");
    navigate(URL.BOARD_CREATE);
  };

  const calculatePostTime = (time) => {
    const now = new Date();
    const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000); // 9시간 추가
    const postDate = new Date(time);
    const postKST = new Date(postDate + 9 * 60 * 60 * 1000); // 기존 게시글에 9시간 추가

    const timeDifference = nowKST - postKST;

    const oneDay = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDay) return 1;
    return 0;
  };

  useEffect(() => {
    getPosts();
  }, [searchOptions.page, searchOptions.category]);

  return (
    <div>
      <h2>커뮤니티</h2>
      <div style={{ margin: "8px 0", textAlign: "right" }}>
        <button onClick={createPost}>글쓰기</button>
      </div>
      {board.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {board.map((post, index) => (
              <div
                style={{ padding: 8, border: "2px solid #000" }}
                key={`post_${index}`}
                onClick={() =>
                  navigate(URL.BOARD_DETAIL, { state: { post_id: post.id } })
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  {calculatePostTime(post.create_time) ? <span>[N]</span> : ""}
                  <span style={{ padding: 4, border: "1px solid #000" }}>
                    {CATEGORY[post.category]}
                  </span>
                  <span>{post.title}</span>
                  <span>[{post.cmt_count}]</span>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span>{post.nickname} * </span>
                  <span>
                    {dayjs(post.create_time).format("YYYY-MM-DD HH:mm")}{" "}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <button
              disabled={searchOptions.page === 0}
              onClick={() =>
                setSearchOptions((state) => ({
                  ...state,
                  page: state.page - 1,
                }))
              }
            >
              이전
            </button>
            <div>{`${searchOptions.page + 1} / ${totalPage}`}</div>
            <button
              disabled={searchOptions.page + 1 === totalPage}
              onClick={() =>
                setSearchOptions((state) => ({
                  ...state,
                  page: state.page + 1,
                }))
              }
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <p>게시글이 존재하지 않습니다.</p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <label style={{ display: "block" }}>
          <select
            onChange={(e) =>
              setSearchOptions((state) => ({
                ...state,
                page: 0,
                category: Number(e.target.value),
              }))
            }
          >
            <option value={-1}>전체</option>
            {Object.keys(CATEGORY).map((category) => (
              <option value={category} key={CATEGORY[category]}>
                {CATEGORY[category]}
              </option>
            ))}
          </select>
        </label>
        <input placeholder="검색어를 입력해주세요" />
        <button>검색</button>
      </div>
    </div>
  );
};

export default Board;
