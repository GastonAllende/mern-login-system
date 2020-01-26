import React, { Component } from 'react';
import Search from '../search';
import LeftNavbar from './leftNavbar';
import RightNavbar from './rightNavbar';


class Header extends Component {
  render() {
    return (
      < nav className="main-header navbar navbar-expand navbar-white navbar-light" >
        <LeftNavbar />
        <Search />
        <RightNavbar />
      </nav >
    )
  }
}

export default Header;
