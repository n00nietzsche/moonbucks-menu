import { elementIdMap } from "./utils/constant_utils.js";
import { useState } from "./utils/state_utils.js";
import { getById } from "./utils/control_dom_utils.js";
import {
  loadMenuApi,
  setApiCategoryName,
  addMenuApi,
  removeMenuApi,
  updateMenuApi,
  soldOutMenuApi,
  handleResponse,
} from "./utils/api_utils.js";

export default function useMenu(
  renderingFunction,
  initCategoryName = "espresso"
) {
  let getMenuState;
  let setMenuState;

  setCategoryName(initCategoryName);

  async function setCategoryName(categoryName) {
    const state = await loadMenuApi(categoryName);

    [getMenuState, setMenuState] = useState(state, renderingFunction, {
      removeMenu,
      updateMenu,
      soldOutMenu,
    });

    const { espressoMenuList } = elementIdMap;
    getById(espressoMenuList).innerHTML = "";

    renderingFunction(getMenuState(), { removeMenu, updateMenu, soldOutMenu });
  }

  async function addMenu(name) {
    if (name) {
      for (const value of Object.values(getMenuState())) {
        if (value.name === name) {
          alert("동일한 이름의 메뉴가 존재합니다!");
          return;
        }
      }

      handleResponse(await addMenuApi(name), (response) => {
        const { data: menu } = response;

        setMenuState({
          ...getMenuState(),
          [menu.id]: menu,
        });
      });
    }
  }

  async function removeMenu(menuId) {
    if (confirm("정말로 삭제하시겠습니까?")) {
      handleResponse(await removeMenuApi(menuId), (response) => {
        const { [menuId]: removeMenu, ...rest } = getMenuState();

        setMenuState({
          ...rest,
        });
      });
    }
  }

  async function soldOutMenu(menuId) {
    handleResponse(await soldOutMenuApi(menuId), (response) => {
      const { [menuId]: soldOutMenuObj, ...rest } = getMenuState();
      soldOutMenuObj.isSoldOut = !soldOutMenuObj.isSoldOut;

      setMenuState({
        [menuId]: soldOutMenuObj,
        ...rest,
      });
    });
  }

  async function updateMenu(menuId) {
    const newName = prompt("수정하고 싶은 이름을 입력해주세요.");

    if (newName) {
      handleResponse(await updateMenuApi(menuId, newName), (response) => {
        const { data: updatedMenu } = response;
        const { [menuId]: oldMenu, ...rest } = getMenuState();

        setMenuState({
          [menuId]: updatedMenu,
          ...rest,
        });
      });
    }
  }

  return [setCategoryName, addMenu, removeMenu, updateMenu, soldOutMenu];
}

// TODO : 타입 정의의 적절한 위치 찾아보기

/**
 * JS doc 타입 정의
 */

/**
 * @typedef {"espresso" | "frappuccino" | "blended" | "teavana" | "dessert"} MenuCategory
 */

/**
 * @typedef {Object} MenuObject
 * @property {String} name
 * @property {boolean} isSoldOut
 */

/**
 * @typedef {Object} UseMenuReturn
 * @property {Object} MenuState
 * @property {Function} AddMenu
 */

/**
 * @typedef {Object} AppendMenuOnClickCallbackObject
 * @property {Function} onClickSoldOut
 * @property {Function} onClickUpdate
 * @property {Function} onClickRemove
 */
