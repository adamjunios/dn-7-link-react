import "../index.css";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../assets/icons/bolt.svg";

import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

import Axios from "axios";

function Dropdown() {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [linkName, setLinkName] = useState();

  //set flexible height of dropdown / menu
  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  //calculation height in every level based on amount of child
  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  //get category (level 1)
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      console.log(response);
      setCategoryList(response.data);
    });
  }, []);

  //get links based on category (level 2)
  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getlinks/${linkName}`).then(
      (response) => {
        console.log(response);
        setLinkList(response.data);
      }
    );
  }, [linkName]);

  //handle clik onclick menu category and links
  function handleClick(nameLink, linkHref) {
    // e.preventDefault();
    console.log(`You clicked ${nameLink}`);
    setLinkName(nameLink);
    nameLink === "main" || nameLink === ""
      ? handleClickMain()
      : setActiveMenu(nameLink);
    linkHref ? openInNewTab(linkHref) : setActiveMenu(nameLink);
  }

  //handle click on menu back
  function handleClickMain() {
    setActiveMenu("main");
    setLinkName("");
  }

  //handle click links
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  //per menu-item content
  function DropdownItem(props) {
    return (
      <a
        href="#"
        className="menu-item-custom"
        onClick={() => handleClick(props.goToMenu, props.goHref)}
      >
        <span className="icon-button-custom">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  //based content
  return (
    <div className="dropdown col-md-12">
      {/* level 1 */}
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          {categoryList.map((val) => {
            return (
              <DropdownItem leftIcon={val.icon} goToMenu={val.id} key={val.id}>
                <h4>{val.name}</h4>
              </DropdownItem>
            );
          })}
        </div>
      </CSSTransition>

      {/* level 2 */}
      <CSSTransition
        in={activeMenu === linkName}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h4>Kembali</h4>
          </DropdownItem>
          {linkList.map((vallink) => {
            return (
              <DropdownItem
                leftIcon={<BoltIcon />}
                goToMenu={linkName}
                goHref={vallink.link}
              >
                {vallink.name}
              </DropdownItem>
            );
          })}
        </div>
      </CSSTransition>
    </div>
  );
}

export default Dropdown;
