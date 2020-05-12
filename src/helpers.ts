import { TouchEvent, MouseEvent } from "react";
import { Coords } from "./index.d";

export type GetPositionFunc = (
  rect: ClientRect,
  coords: [number, number]
) => {
  top: number;
  left: number;
};

export const getMenuPosition: GetPositionFunc = (rect, [x, y]) => {
  const menuStyles = {
    top: y,
    left: x,
  };

  const { innerWidth, innerHeight } = window;

  if (y + rect.height > innerHeight) {
    menuStyles.top -= rect.height;
  }

  if (x + rect.width > innerWidth) {
    menuStyles.left -= rect.width;
  }

  if (menuStyles.top < 0) {
    menuStyles.top =
      rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
  }

  if (menuStyles.left < 0) {
    menuStyles.left =
      rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
  }

  return menuStyles;
};

export const getRTLMenuPosition: GetPositionFunc = (rect, [x, y]) => {
  const menuStyles = {
    top: y,
    left: x,
  };

  const { innerWidth, innerHeight } = window;

  // Try to position the menu on the left side of the cursor
  menuStyles.left = x - rect.width;

  if (y + rect.height > innerHeight) {
    menuStyles.top -= rect.height;
  }

  if (menuStyles.left < 0) {
    menuStyles.left += rect.width;
  }

  if (menuStyles.top < 0) {
    menuStyles.top =
      rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
  }

  if (menuStyles.left + rect.width > innerWidth) {
    menuStyles.left =
      rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
  }

  return menuStyles;
};

export const getCoords = (
  event: TouchEvent | MouseEvent,
  [posX, posY]: Coords
): Coords => {
  return [
    (event as MouseEvent).clientX ||
      ((event as TouchEvent).touches &&
        (event as TouchEvent).touches[0].pageX) - posY,
    (event as MouseEvent).clientY ||
      ((event as TouchEvent).touches &&
        (event as TouchEvent).touches[0].pageY) - posX,
  ];
};

export const isNumber = (x: unknown): x is number => typeof x === "number";
