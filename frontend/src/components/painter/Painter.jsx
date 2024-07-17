import { useEffect, useRef, useState } from "react";
import { getCoords } from "utils/fn";
import style from "css/module/Painter.module.css";

const Tool = {
  BRUSH: 0,
  ERASER: 1,
};
const Painter = ({ canvas }) => {
  const container = useRef();
  const cursor = useRef();
  const isDrawing = useRef(false);
  const ctx = useRef();
  const [tool, setTool] = useState(Tool.BRUSH);
  const [config, setConfig] = useState({ color: "#000000", size: 10 });
  const [hideCursor, setHideCursor] = useState(true);

  const handleDown = (e) => {
    isDrawing.current = true;
    const { x, y } = getCoords(e);
    const posX = x - container.current.offsetLeft;
    const posY = y - container.current.offsetTop;

    switch (tool) {
      case Tool.BRUSH:
        ctx.current.beginPath();
        ctx.current.moveTo(posX, posY);
        break;
      case Tool.ERASER:
        break;
      default:
    }
  };
  const handleMove = (e) => {
    const { x, y } = getCoords(e);
    const posX = x - container.current.offsetLeft;
    const posY = y - container.current.offsetTop;

    cursor.current.style.top = posY + "px";
    cursor.current.style.left = posX + "px";

    if (!isDrawing.current) return;

    switch (tool) {
      case Tool.BRUSH:
        ctx.current.lineTo(posX, posY);
        ctx.current.stroke();
        break;
      case Tool.ERASER:
        ctx.current.beginPath();
        ctx.current.arc(posX, posY, config.size / 2, 0, Math.PI * 2);
        ctx.current.fill();
        break;
      default:
    }
  };
  const handleUp = () => (isDrawing.current = false);
  const handleEnter = () => setHideCursor(false);
  const handleOut = () => {
    isDrawing.current = false;
    setHideCursor(true);
  };

  const clearCanvas = () => {
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
  };

  useEffect(() => {
    canvas.current.width = canvas.current.clientWidth;
    canvas.current.height = canvas.current.clientHeight;

    ctx.current = canvas.current.getContext("2d");
    ctx.current.lineCap = "round";
    ctx.current.lineJoin = "round";
    ctx.current.lineWidth = config.size;
    ctx.current.strokeStyle = config.color;
  }, []);

  useEffect(() => {
    if (!ctx.current) return;
    ctx.current.strokeStyle = config.color;
    ctx.current.lineWidth = config.size;
  }, [config]);

  useEffect(() => {
    switch (tool) {
      case Tool.BRUSH:
        ctx.current.globalCompositeOperation = "source-over";
        break;
      case Tool.ERASER:
        ctx.current.globalCompositeOperation = "destination-out";
        break;
      default:
    }
  }, [tool]);

  return (
    <div
      ref={container}
      style={{
        position: "relative",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <canvas
        ref={canvas}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseEnter={handleEnter}
        onMouseOut={handleOut}
        style={{ width: "100%", border: "1px solid #000", flex: 1 }}
      ></canvas>
      <div className={style.tools}>
        <div>
          <button
            onClick={() => setTool(Tool.BRUSH)}
            style={{
              border:
                tool === Tool.BRUSH ? "2px solid red" : "2px solid transparent",
            }}
          >
            브러쉬
          </button>
          <button
            onClick={() => setTool(Tool.ERASER)}
            style={{
              border:
                tool === Tool.ERASER
                  ? "2px solid red"
                  : "2px solid transparent",
            }}
          >
            지우개
          </button>
        </div>
        <div className={style.right}>
          <input
            type="color"
            value={config.color}
            onChange={(e) =>
              setConfig((state) => ({ ...state, color: e.target.value }))
            }
          />
          <input
            type="range"
            min={1}
            max={50}
            step={0.5}
            value={config.size}
            onChange={(e) =>
              setConfig((state) => ({ ...state, size: Number(e.target.value) }))
            }
          />
          <button onClick={clearCanvas}>초기화</button>
        </div>
      </div>
      <div
        ref={cursor}
        style={{
          display: hideCursor ? "none" : "block",
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          width: config.size,
          height: config.size,
          borderRadius: "50%",
          border: "1px solid green",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};
export default Painter;
