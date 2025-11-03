import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  Avatar,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import React, { useState, } from 'react';
import { BellIcon, ChevronDownIcon, } from "@chakra-ui/icons";
import { ChatState, } from "../../Context/ChatProvider";
import ProfileModal from './ProfileModal';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);

  const { user } = ChatState();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip
        label="Search users to chat"
        hasArrow
        placement="bottom-end"
      >
        <Button variant="ghost">
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontFamily="Work sans">
        MERN WebSockets Chat App
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon/>
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
  )
}

export default SideDrawer