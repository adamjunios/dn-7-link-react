import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg";
import { ReactComponent as AboutIcon } from "../assets/icons/about.svg";
import { ReactComponent as RightArrowIcon } from "../assets/icons/right-arrow.svg";

import "../index.css";
import PosterContoh from "../assets/modal/story-otw2.png";

import Modal from "./Modal/Modal";

import { db } from "./firebase/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";

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
  const [activeIdCategory, setActiveIdCategory] = useState([]);
  //modal state
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalLink, setModalLink] = useState("");

  //connect to db
  const categoriesCollectionRef = collection(db, "categories");
  const linksCollectionRef = collection(db, "links");

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
    //using firebase
    const getCategories = async () => {
      const dataCategories = await getDocs(categoriesCollectionRef);
      setCategoryList(
        dataCategories.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getCategories();

    // using API
    // Axios.get("http://localhost:3001/api/get").then((response) => {
    //   console.log(response);
    //   setCategoryList(response.data);
    // });
  }, []);

  //get link without category (level 1)
  useEffect(() => {
    // use Firebase
    const getLinkLv1 = async () => {
      const q = query(
        collection(db, "links"),
        where("category_id", "==", null)
      );

      const querySnapshot = await getDocs(q);
      setLinkLv1List(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getLinkLv1();

    // use API
    // Axios.get("http://localhost:3001/api/get-lv1-link").then((response) => {
    //   console.log(response);
    //   setLinkLv1List(response.data);
    // });
  }, []);

  //get links based on category (level 2)
  useEffect(() => {
    // use Firebase
    const getLinks = async () => {
      const q = query(
        collection(db, "links"),
        where("category_id", "==", activeMenu)
      );
      const querySnapshotLinks = await getDocs(q);
      setLinkList(
        querySnapshotLinks.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getLinks();

    // using API
    // Axios.get(`http://localhost:3001/api/getlinks/${idCategory}`).then(
    //   (response) => {
    //     console.log(response);
    //     setLinkList(response.data);
    //   }
    // );
  }, [activeMenu]);

  //handle clik onclick menu category and links
  function handleClick(e, idCategory, linkCategoryName, linkHref) {
    console.log(`You clicked ${idCategory} ${linkCategoryName}`);

    if (idCategory === "main" || idCategory === "") {
      e.preventDefault();
      handleClickMain();
    } else {
      setActiveMenu(idCategory);
      setActiveIdCategory(idCategory);
      e.preventDefault();
      setCategoryName(linkCategoryName);
    }

    console.log(`Active Id Cate ${activeIdCategory}`);
    //on click links
    linkHref ? openInNewTab(linkHref) : setActiveMenu(idCategory);
  }

  //handle click on menu back
  function handleClickMain() {
    setActiveMenu("main");
    setActiveIdCategory("");
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
        onClick={(e) => {
          handleClick(e, props.goToMenu, props.goCategoryName, props.goHref);
        }}
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
                  leftIcon={<AboutIcon />}
                  key={val.id}
                  goHref={val.links}
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
          in={activeMenu === activeIdCategory}
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
                  leftIcon={<AboutIcon />}
                  goToMenu={activeIdCategory}
                  goHref={vallink.links}
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
