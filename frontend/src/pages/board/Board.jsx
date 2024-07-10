import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../../api/fetch";
import { CATEGORY } from "../../constants/constants";
import URL from "../../constants/url";

const columns = ["카테고리", "제목", "내용", "작성자"];

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
    if(timeDifference < oneDay){
      return 1;
    } 
    return 0;
  };

  useEffect(() => {
    getPosts();
  }, [searchOptions.page, searchOptions.category]);

  return (
    <div>
      <h2>커뮤니티</h2>
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
      {board.length > 0 ? (
        <>
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
                  <td>{`${calculatePostTime(post.create_time) ? "[N]" : ""} ${
                    post.title
                  }`}</td>
                  <td>
                    {post.content}
                    {`[${post.cmt_count}]`}
                  </td>
                  <td>{post.nickname}</td>
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
      <button onClick={createPost}>글쓰기</button>
    </div>
  );
};

export default Board;
