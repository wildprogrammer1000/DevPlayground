import { useEffect, useState } from "react";
import { requestGet } from "../../api/fetch";
import { useNavigate } from "react-router-dom";
import { getSessionItem } from "../../utils/storage";
import { CATEGORY } from "../../constants/constants";
import URL from "../../constants/url";

const columns = ["카테고리", "제목", "내용", "작성자"];

const Board = () => {
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
    const session = getSessionItem("userTokens");
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate(URL.BOARD_CREATE);
  };

  useEffect(() => {
    getPosts();
  }, [searchOptions.page, searchOptions.category]);

  return (
    <div>
      <div>게시판</div>
      {board.length > 0 ? (
        <>
          <label>
            <span>카테고리</span>
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
          <table>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={`col_${index}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {board.map((post, index) => (
                <tr
                  key={`post_${index}`}
                  onClick={() =>
                    navigate(URL.BOARD_DETAIL, { state: { post_id: post.id } })
                  }
                >
                  <td>{CATEGORY[post.category]}</td>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>{post.user_nickname}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", gap: 8 }}>
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
              disabled={searchOptions.page === totalPage}
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
        <div>게시글이 존재하지 않습니다.</div>
      )}
      <button onClick={createPost}>글쓰기</button>
    </div>
  );
};

export default Board;
