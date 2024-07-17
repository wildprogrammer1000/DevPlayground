import Chat from "components/chat/Chat";
import Painter from "components/painter/Painter";
import { useRef } from "react";

const Main = ({ user, socket }) => {
  const canvas = useRef();
  return (
    <div>
      {/* <Chat socket={socket} channel={"all"} user={user} /> */}
      <Painter canvas={canvas} />
    </div>
  );
};

export default Main;
