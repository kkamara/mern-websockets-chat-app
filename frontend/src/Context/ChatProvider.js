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

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/")
    }
  }, []);

  return (
    <chatContext.Provider value={{ user, setUser, }}>
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  useContext(chatContext);
};

export default ChatProvider;