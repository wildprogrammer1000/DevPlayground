import URL from "constants/url";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "css/module/Gallery.module.css";

const GalleryPiece = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [piece, setPiece] = useState();

  useEffect(() => {
    const { piece } = location.state;
    if (!piece) {
      alert("잘못된 접근입니다.");
      navigate(URL.GALLERY);
      return;
    }
    setPiece(piece);
  }, []);

  return piece ? (
    <div className={style.gallery_piece}>
      <div className={style.piece_wrapper}>
        <div className={style.title}>{piece.name}</div>
        <img alt={`piece_${piece.name}`} src={piece.imgUrl} />
        <div className={style.description}>{piece.description}</div>
      </div>
      <button className={style.btn_back} onClick={() => navigate(URL.GALLERY)}>
        다른 작품 보러가기
      </button>
    </div>
  ) : (
    <div>작품을 가져오는 중이에요.</div>
  );
};
export default GalleryPiece;
