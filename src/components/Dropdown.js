import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../assets/icons/bolt.svg";
import { ReactComponent as RightArrowIcon } from "../assets/icons/right-arrow.svg";

import "../index.css";
import PosterContoh from "../assets/modal/story-otw2.png";

import Modal from "./Modal/Modal";

function Dropdown() {
  //menu state
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  //fetch data state
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("main");
  const [linklv1List, setLinkLv1List] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [idLink, setidLink] = useState();
  //modal state
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalLink, setModalLink] = useState("");

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

  //get link without category (level 1)
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get-lv1-link").then((response) => {
      console.log(response);
      setLinkLv1List(response.data);
    });
  }, []);

  //get links based on category (level 2)
  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getlinks/${idLink}`).then(
      (response) => {
        console.log(response);
        setLinkList(response.data);
      }
    );
  }, [idLink]);

  //handle clik onclick menu category and links
  function handleClick(idLink, linkCategoryName, linkHref) {
    console.log(`You clicked ${idLink} ${linkCategoryName}`);
    setidLink(idLink);

    if (idLink === "main" || idLink === "") {
      handleClickMain();
    } else {
      setActiveMenu(idLink);
      setCategoryName(linkCategoryName);
    }

    //on click links
    linkHref ? openInNewTab(linkHref) : setActiveMenu(idLink);
  }

  //handle click on menu back
  function handleClickMain() {
    setActiveMenu("main");
    setidLink("");
    setCategoryName("main");
  }

  //handle click links
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  //handle clik to show modal
  function handleClickLeftIcon(
    modalCategoryName,
    modalLinkName,
    modalBody,
    modalLink,
    e
  ) {
    if (modalLink) {
      categoryName === "main"
        ? setModalTitle(modalLinkName)
        : setModalTitle(modalCategoryName + " - " + modalLinkName);
      setModalBody(modalBody);
      setModalLink(modalLink);
      setShow(true);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  //per menu-item content
  function DropdownItem(props) {
    return (
      <a
        href="#"
        className="menu-item-custom"
        onClick={() =>
          handleClick(props.goToMenu, props.goCategoryName, props.goHref)
        }
      >
        <span
          className="icon-button-custom"
          onClick={(e) => {
            handleClickLeftIcon(
              props.goCategoryName,
              props.goLinkName,
              props.goToMenu,
              props.goHref,
              e
            );
          }}
        >
          {props.leftIcon}
        </span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  //based content
  return (
    <>
      <Modal
        onClose={() => setShow(false)}
        show={show}
        modalTitle={modalTitle}
        modalBody={modalBody + PosterContoh}
        modalLink={modalLink}
      />
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
                <DropdownItem
                  leftIcon={val.icon}
                  goToMenu={val.id}
                  key={val.id}
                  goCategoryName={val.name}
                  rightIcon={<RightArrowIcon />}
                >
                  <h4>{val.name}</h4>
                </DropdownItem>
              );
            })}
            {linklv1List.map((val) => {
              return (
                <DropdownItem
                  goToMenu="main"
                  leftIcon={<BoltIcon />}
                  key={val.id}
                  goHref={val.link}
                  goLinkName={val.name}
                  goCategoryName={categoryName}
                >
                  {val.name}
                </DropdownItem>
              );
            })}
          </div>
        </CSSTransition>
        {/* level 2 */}
        <CSSTransition
          in={activeMenu === idLink}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              goToMenu="main"
              goCategoryName="main"
              leftIcon={<ArrowIcon />}
            >
              <h4>Kembali</h4>
            </DropdownItem>

            {linkList.map((vallink) => {
              return (
                <DropdownItem
                  leftIcon={<BoltIcon />}
                  goToMenu={idLink}
                  goHref={vallink.link}
                  goLinkName={vallink.name}
                  goCategoryName={categoryName}
                >
                  {vallink.name}
                </DropdownItem>
              );
            })}
          </div>
        </CSSTransition>
      </div>
    </>
  );
}

export default Dropdown;
