import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoHome } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const MenuBar = () => {
  return (
    <Container>
      <Menu>
        <LogoContainer>
          <Logo src={require('../Assets/motodo_logo.png')} alt="MoToDo Logo" />
        </LogoContainer>
        <CurrentDateTimeContainer>
          <CurrentDateTime />
        </CurrentDateTimeContainer>
        <Heading>Menu</Heading>
        <NavList>
          <NavItem to="/home" title="Home">
            <IoHome className="icon" />
            <span>Home</span>
          </NavItem>
          <NavItem to="/calendar" title="Calendar">
            <FaCalendarCheck className="icon" />
            <span>Calendar</span>
          </NavItem>
          <NavItem to="#" title="Sticky">
            <FaStickyNote className="icon" />
            <span>Sticky</span>
          </NavItem>
        </NavList>

        <Heading>Mo</Heading>
        <NavList>
          <NavItem to="/friends" title="Friends">
            <span>Friends</span>
          </NavItem>
          <NavItem to="#" title="Group">
            <span>Group</span>
          </NavItem>
        </NavList>

        {/* 버튼을 메뉴 하단에 추가 */}
        <ButtonGroup>
          <Button onClick={() => console.log('Option 1')}>1</Button>
          <Button onClick={() => console.log('Option 2')}>2</Button>
        </ButtonGroup>
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
  background-color: #f4f4f4;
  color: #333;
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
`;

const CurrentDateTimeContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
`;

const Heading = styled.span`
  color: #333;
  font-size: 20px;
  line-height: 1;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled(Link)`
  background-color: #f4f4f4;
  border-radius: 0.75em;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0.75em;
  text-align: left;
  transition: background-color 0.3s ease;
  margin-bottom: 0.5em;
  text-decoration: none;

  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
    color: #333;
  }

  .icon {
    display: block;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.75em;
  }
`;

const ButtonGroup = styled.div`
  display: inline-block;
 margin: 20px 10px 10px 10px;
`;

const Button = styled.button`
  width: 50%;
  height: 50px;
  background-color: #ffffff;
  border: none;
  color: black;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

export default MenuBar;
