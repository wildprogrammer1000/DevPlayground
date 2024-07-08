import Chat from "../components/chat/Chat";

const Main = ({ user, socket }) => {
  return (
    <div>
      <Chat socket={socket} channel={"all"} user={user} />
    </div>
  );
};

export default Main;
