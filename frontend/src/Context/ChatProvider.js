import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory, } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/")
    }
  }, []);

  return (
    <chatContext.Provider value={{
      user,
      setUser,
      selectedChat,
      setSelectedChat,
      chats,
      setChats,
      notification,
      setNotification,
    }}>
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => useContext(chatContext);;

export default ChatProvider;