import React from 'react';
import { useTheme } from '../Context/themeProvider';
import styled from 'styled-components';
import { IoHome } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const MenuBar = () => {
  const [ThemeMode, toggleTheme] = useTheme();

  return (
    <Container>
      <OptionBar>
        <Button onClick={() => console.log('Option 1')}>1</Button>
        <Button onClick={() => console.log('Option 2')}>2</Button>
        <Button onClick={toggleTheme}>
          {ThemeMode === 'dark' ? 'dark' : 'light'}
        </Button>
      </OptionBar>
      <Menu>
        <CurrentDateTime />
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
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const OptionBar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 10%;
  width: 100%;
  background-color: ${({ theme }) => theme.bgColor};
  border: ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease-in-out;
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.optionButtonBg};
  border: none;
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.optionButtonHoverBg};
    transform: scale(1.05);  // Optional: add slight scaling effect for better feedback
  }
`;

const Menu = styled.nav`
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Heading = styled.span`
  color: ${({ theme }) => theme.textColor};
  font-size: 0.75em;
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

const NavItem = styled.li`
  background-color: ${({ theme }) => theme.bgColor};
  border-radius: 0.75em;
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  padding: 0.75em;
  text-align: left;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin-bottom: 0.5em;  // Optional: add spacing between items

  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
    color: ${({ theme }) => theme.textColor};
  }

  .icon {
    display: block;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.75em;
  }
`;

export default MenuBar;
