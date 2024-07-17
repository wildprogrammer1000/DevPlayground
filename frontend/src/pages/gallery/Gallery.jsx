import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import URL from "constants/url";
import style from "css/module/Gallery.module.css";

const Gallery = () => {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const getPieces = () => {
    const storedPieces = localStorage.getItem("gallery");
    if (storedPieces) setPieces(JSON.parse(storedPieces));
  };
  const openPiece = (piece) => {
    navigate(URL.GALLERY_PIECE, { state: { piece } });
  };
  useEffect(() => {
    getPieces();
  }, []);
  return (
    <div className={style.gallery}>
      <div className={style.pieces_wrapper}>
        {pieces.length > 0 ? (
          pieces.map((p, i) => (
            <div
              key={`piece_${i}`}
              className={style.piece}
              onClick={() => openPiece(p)}
            >
              <div className={style.cover}>{p.name}</div>
              <img width="100%" alt={`piece_${p.name}_${i}`} src={p.imgUrl} />
              <div style={{ textAlign: "right", color: "#999", fontSize: 10 }}>
                by 000
              </div>
            </div>
          ))
        ) : (
          <div>전시된 작품이 없어요.</div>
        )}
      </div>
      <Link to={URL.GALLERY_CREATE} className={style.btn_create}>
        그림 그리기
      </Link>
    </div>
  );
};

export default Gallery;
