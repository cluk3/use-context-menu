export interface ContextTriggerConfig {
  collect: () => unknown;
  disable: boolean;
  disableIfShiftIsPressed: boolean;
  holdToDisplay: {
    mouse: boolean | number;
    touch: boolean | number;
  };
  posX: number;
  posY: number;
}

export type Coords = [number, number];

export interface MenuStyles {
  top: number;
  left: number;
}
