import Painter from "components/painter/Painter";
import URL from "constants/url";
import style from "css/module/Gallery.module.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const GalleryCreate = () => {
  const navigate = useNavigate();
  const canvas = useRef();
  const [pieceInfo, setPieceInfo] = useState({ name: "", description: "" });
  const submitPiece = () => {
    if (pieceInfo.name === "") return alert("작품명을 입력해주세요.");
    if (pieceInfo.description === "") return alert("작품소개를 입력해주세요.");

    const dataUrl = canvas.current.toDataURL();

    // Temp Storage
    const storedPieces = localStorage.getItem("gallery")
      ? JSON.parse(localStorage.getItem("gallery"))
      : [];
    storedPieces.push({ ...pieceInfo, imgUrl: dataUrl });
    localStorage.setItem("gallery", JSON.stringify(storedPieces));
    navigate(URL.GALLERY);
  };
  return (
    <div className={style.gallery_create}>
      <input
        placeholder="작품명"
        className={style.title}
        value={pieceInfo.name}
        onChange={(e) =>
          setPieceInfo((state) => ({ ...state, name: e.target.value }))
        }
      />
      <div className={style.canvas_wrapper}>
        <Painter canvas={canvas} />
      </div>
      <textarea
        placeholder="작품 소개"
        className={style.description}
        value={pieceInfo.description}
        onChange={(e) =>
          setPieceInfo((state) => ({ ...state, description: e.target.value }))
        }
      />
      <button className={style.btn_create} onClick={submitPiece}>
        전시하기
      </button>
    </div>
  );
};
export default GalleryCreate;
