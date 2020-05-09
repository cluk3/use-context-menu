import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getMenuPosition, getRTLMenuPosition } from "./helpers";
import buildUseContextMenuTrigger from "./buildUseContextMenuTrigger";

export const keyCodes = {
  ESCAPE: 27,
  ENTER: 13,
  TAB: 9,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
};
const baseStyles = {
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
  top: 0,
  left: 0,
  userSelect: "none",
  transform: "translate3d(0,0,0)",
};

const focusElement = (el) => el.focus();
const useContextMenu = ({
  rtl,
  handleElementSelect = focusElement,
  hideOnScroll = false,
} = {}) => {
  const menuRef = useRef();
  const selectables = useRef([]);
  // TODO: refactor with useReducer
  const [style, setStyles] = useState(baseStyles);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVisible, setVisible] = useState(false);
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;
  const [coords, setCoords] = useState([0, 0]);
  const [collectedData, setCollectedData] = useState();
  const hideMenu = useCallback(() => {
    setVisible(false);
    setSelectedIndex(-1);
  }, [setVisible, setSelectedIndex]);
  const triggerVisible = useCallback(
    (coords, data) => {
      setVisible(true);
      setCoords(coords);
      setCollectedData(data);
    },
    [setVisible, setCollectedData, setCoords]
  );

  const markSelectable = (el) =>
    (selectables.current = el === null ? [] : [...selectables.current, el]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isVisibleRef.current &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        hideMenu();
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("touchstart", handleOutsideClick);
      }
    };
    const handleKeyNavigation = (e) => {
      switch (e.keyCode) {
        case keyCodes.TAB:
          hideMenu();
          break;
        case keyCodes.ESCAPE:
          e.preventDefault();
          hideMenu();
          break;
        case keyCodes.UP_ARROW:
          e.preventDefault();
          if (selectedIndex > 0) {
            setSelectedIndex((s) => s - 1);
            handleElementSelect(selectables.current[selectedIndex - 1]);
          }
          break;
        case keyCodes.DOWN_ARROW:
          e.preventDefault();
          if (selectedIndex + 1 < selectables.current.length) {
            setSelectedIndex((s) => s + 1);
            handleElementSelect(selectables.current[selectedIndex + 1]);
          }
          break;
        case keyCodes.ENTER:
          if (selectedIndex !== -1) {
            selectables.current[selectedIndex].click();
          }
          hideMenu();
          break;
        default:
      }
    };
    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick, {
        passive: true,
        capture: true,
      });
      document.addEventListener("touchstart", handleOutsideClick, {
        passive: true,
        capture: true,
      });
      hideOnScroll &&
        document.addEventListener("scroll", hideMenu, {
          once: true,
        });
      document.addEventListener("keydown", handleKeyNavigation);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("scroll", hideMenu);
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [
    menuRef,
    hideMenu,
    selectedIndex,
    setSelectedIndex,
    selectables,
    handleElementSelect,
    isVisible,
    hideOnScroll,
  ]);

  useLayoutEffect(() => {
    if (isVisible) {
      const rect = menuRef.current.getBoundingClientRect();
      const { top, left } = rtl
        ? getRTLMenuPosition(rect, coords)
        : getMenuPosition(rect, coords);
      setStyles((st) => ({
        ...st,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: 1,
        pointerEvents: "auto",
      }));
    } else {
      setStyles(baseStyles);
    }
  }, [menuRef, isVisible, coords, rtl]);

  const bindMenuProps = {
    style,
    ref: menuRef,
    role: "menu",
    tabIndex: 0,
    onContextMenu: (e) => e.preventDefault(),
    "aria-hidden": !isVisible,
  };
  const bindMenuItemProps = {
    ref: markSelectable,
    role: "menuitem",
    tabIndex: -1,
  };
  return [
    bindMenuProps,
    bindMenuItemProps,
    buildUseContextMenuTrigger(triggerVisible),
    {
      data: collectedData,
      hideMenu,
      isVisible,
      setVisible,
      coords,
      setCoords,
    },
  ];
};

export default useContextMenu;
