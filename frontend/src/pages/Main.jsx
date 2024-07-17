import Chat from "components/chat/Chat";
import Painter from "components/painter/Painter";

const Main = ({ user, socket }) => {
  return (
    <div>
      <Chat socket={socket} channel={"all"} user={user} />
      {/* <Painter /> */}
    </div>
  );
};

export default Main;
