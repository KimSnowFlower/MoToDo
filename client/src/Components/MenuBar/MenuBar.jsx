import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MenuBar = () => {
  return (
    <Container>
      <Menu>
        <LogoContainer>
          <Logo src={require('../Assets/motodo_logo.png')} alt="MoToDo Logo" />
        </LogoContainer>

        <NavList>
          <NavItem to="/home" title="Home">
            <img src={require('../Assets/home_button.png')} alt="Home" className="icon" />
            <span>Home</span>
          </NavItem>
          <NavItem to="/calendar" title="Calendar">
            <img src={require('../Assets/calendar_button.png')} alt="Calendar" className="icon" />
            <span>Calendar</span>
          </NavItem>
          <NavItem to="/sticky" title="Sticky">
            <img src={require('../Assets/sticky_button.png')} alt="Sticky" className="icon" />
            <span>Sticky</span>
          </NavItem>
          <NavItem to="/friends" title="Friends">
            <img src={require('../Assets/friends_button.png')} alt="Friends" className="icon" />
            <span>Friends</span>
          </NavItem>
          <NavItem to="/group" title="Group">
            <img src={require('../Assets/group_button.png')} alt="Group" className="icon" />
            <span>Group</span>
          </NavItem>
        </NavList>
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Menu = styled.nav`
  background-color: #white;
  color: #333;
  width: 10%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled(Link)`
  background-color: #white;
  border-radius: 0.75em;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0.25em; /* 간격을 줄이기 위해 padding 값을 줄였습니다 */
  text-align: left;
  transition: background-color 0.3s ease;
  margin-bottom: 0.125em; /* 간격을 줄이기 위해 margin 값을 줄였습니다 */
  text-decoration: none;

  &:hover {
    background-color: #146C94;
    color: #FAFAFA;
  }

  .icon {
    display: block;
    width: 2em; 
    height: 2em; 
    margin-right: 1em;
  }

  span {
    font-size: 1.2em; /* 텍스트 크기를 키우기 위해 font-size 값을 증가시켰습니다 */
  }
`;

export default MenuBar;
