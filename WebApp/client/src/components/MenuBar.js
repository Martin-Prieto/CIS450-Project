import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="light" theme="success" expand="md">
        <NavbarBrand href="/">Tennis DB</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/grand">
                Grand Slams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/matches" >
                Matches
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/players">
                Players
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
