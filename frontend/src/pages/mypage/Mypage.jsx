import { useEffect, useState } from "react";
import URL from "../../constants/url";
import { requestGet } from "../../api/fetch";
import CODE from "../../constants/code";

const Mypage = () => {
  const [mydata, setMydata] = useState({
    mydata: [],
    board: [],
    comment: [],
    active: [],
  });

  const getPosts = async () => {
    requestGet(URL.MYPAGE_GET, null, (res) => {
      if (res.status === CODE.SUCCESS) { // Assuming 200 is the success code, check what CODE.SUCCESS is in your context
        console.log('데이터: ', res.data);
        setMydata({
          mydata: res.data.mydata[0],
          board: res.data.board[0],
          comment: res.data.comment[0],
          active: res.data.active[0],
        });
      } else {
        console.error('Request failed with status: ', res.status);
      }
    }, (error) => {
      console.error('Error fetching data: ', error);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <h2>마이페이지</h2>
      {mydata ?
        <div>
          총 게시글 수: {mydata.board ? mydata.board.count : '로딩중...'} &ensp;
          총 댓글 수: {mydata.comment ? mydata.comment.count : '로딩중...'} &ensp;
          총 활동기간: {mydata.active ? mydata.active.active_time : '로딩중...'}일
          <br /><br />
          <table>
            <thead>
              <tr>
                <td>번호</td>
                <td>{mydata.mydata.id}</td>
              </tr>
              <tr>
                <td>닉네임</td>
                <td>{mydata.mydata.nickname}</td>
              </tr>
              <tr>
                <td>가입경로</td>
                <td>{mydata.mydata.platform}</td>
              </tr>
              <tr>
                <td>가입일</td>
                <td>{mydata.mydata.create_time}</td>
              </tr>
              <tr>
                <td>권한</td>
                <td>{mydata.mydata.role}</td>
              </tr>
              <tr>
                <td>메일</td>
                <td>{mydata.mydata.email}</td>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        : <div>로딩중입니다.</div>}
    </div>
  );
};

export default Mypage;
