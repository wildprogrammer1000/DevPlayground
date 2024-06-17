import { useEffect, useState } from "react";
import { requestGet } from "../../api/fetch";
import { useNavigate } from "react-router-dom";
import URL from "../../constants/url";
import { getSessionItem } from "../../utils/storage";

const columns = ["제목", "내용", "작성자"];
const Board = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    page: 0,
    totalPage: 0,
  });
  const getPosts = () => {
    requestGet(URL.BOARD, { page: searchOptions.page }, (res) => {
      console.log("Board Response: ", res);
      const { board } = res.data;
      setBoard(board);
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
  }, []);

  return (
    <div>
      <div>게시판</div>
      {board.length > 0 ? (
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
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>{post.user_nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>게시글이 존재하지 않습니다.</div>
      )}
      <button onClick={createPost}>글쓰기</button>
    </div>
  );
};

export default Board;
