/* eslint-disable consistent-return */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { collection, addDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { enterRoom } from "../features/appSlice";
import { db } from "../firebase";
import CreateChannelModal from "./CreateChannelModal";

export default function SidebarOption({ title, Icon, addChannelOption, id }) {
  const dispatch = useDispatch();
  const [opened, setOpened] = useState(false);
  const [channelName, setChannelName] = useState("");

  const addChannel = async () => {
    if (channelName) {
      try {
        await addDoc(collection(db, "rooms"), {
          name: channelName,
        });
      } catch {
        return false;
      }
    }
  };

  useEffect(() => {
    addChannel();
  }, [channelName]);

  const selectChannel = () => {
    if (id) {
      dispatch(enterRoom({ roomId: id }));
    }
  };

  return (
    <>
      <SidebarOptionContainer
        onClick={addChannelOption ? () => setOpened(true) : selectChannel}
      >
        {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
        {Icon ? (
          <h3>{title}</h3>
        ) : (
          <SidebarOptionChannel>
            <span>#</span> {title}
          </SidebarOptionChannel>
        )}
      </SidebarOptionContainer>
      <CreateChannelModal
        opened={opened}
        setOpened={setOpened}
        setChannelName={setChannelName}
        addChannel={addChannel}
      />
    </>
  );
}

SidebarOption.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.elementType,
  addChannelOption: PropTypes.bool,
  id: PropTypes.string,
};

SidebarOption.defaultProps = {
  addChannelOption: false,
  Icon: null,
  id: null,
};

const SidebarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;

  :hover {
    opacity: 0.9;
    background-color: #340e36;
  }

  > h3 {
    font-weight: 500;

    > span {
      padding: 15px;
    }
  }
`;

const SidebarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight: 300;
`;
