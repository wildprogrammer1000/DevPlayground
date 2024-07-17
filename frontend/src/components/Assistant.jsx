import User from "pages/user/User";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "utils/context";
import { getCoords } from "utils/fn";

const size = { x: 50, y: 50 };
const Menu = {
  NOTICE: 0,
  TALK: 1,
  USER: 2,
};
const Assistant = () => {
  const isDragging = useRef(false);
  const isMoved = useRef(false);
  const assistRef = useRef();
  const [position, setPosition] = useState({
    x: window.innerWidth,
    y: window.innerHeight / 2,
  });
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(Menu.NOTICE);

  const components = {
    // [Menu.NOTICE]: </>,
    // [Menu.TALK]: </>,
    [Menu.USER]: <User />,
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    assistRef.current.style.transition = "none";
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    isMoved.current = true;
    const { x, y } = getCoords(e);
    setPosition({ x, y });
  };
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    if (isMoved.current) {
      setPosition((state) => ({
        ...state,
        x:
          state.x > window.innerWidth / 2
            ? window.innerWidth - size.x / 2
            : size.x / 2,
      }));
    } else setOpen(true);

    isDragging.current = false;
    isMoved.current = false;
    assistRef.current.style.transition = "0.3s";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      console.log("Assistant was unmounted");
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: `translate(-50%, ${open ? 0 : 100}%)`,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 500,
          height: "60%",
          backgroundColor: "#fff",
          border: "2px solid #000",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            padding: 16,
            fontSize: 20,
            borderBottom: "2px solid #000",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontFamily: "NN Heavy",
              letterSpacing: -0.5,
            }}
          >
            PLAYGROUNDDEV
          </div>
          <button
            style={{ position: "absolute", top: 16, right: 16 }}
            onClick={() => setOpen(false)}
          >
            닫기
          </button>
        </div>
        <div style={{ flex: 1, borderBottom: "2px solid #000" }}>
          {components[menu] && components[menu]}
        </div>
        <div style={{ display: "flex", height: 60 }}>
          <button style={{ flex: 1 }} onClick={() => setMenu(0)}>
            공지사항
          </button>
          <button style={{ flex: 1 }} onClick={() => setMenu(1)}>
            1:1 상담
          </button>
          <button style={{ flex: 1 }} onClick={() => setMenu(2)}>
            프로필
          </button>
        </div>
      </div>
      <div
        ref={assistRef}
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          transform: "translate(-50%, -50%)",
          width: size.x,
          height: size.y,
          borderRadius: "50%",
          border: "2px solid #000",
          backgroundColor: "#fff",
          transition: "0.3s",
        }}
        onMouseOver={() => {
          setPosition((state) => ({
            ...state,
            x:
              state.x > window.innerWidth / 2
                ? state.x - size.x / 2
                : state.x + size.x / 2,
          }));
        }}
        onMouseOut={() => {
          setPosition((state) => ({
            ...state,
            x:
              state.x > window.innerWidth / 2
                ? state.x + size.x / 2
                : state.x - size.x / 2,
          }));
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      ></div>
    </>
  );
};
export default Assistant;
