import { useRef, useCallback } from "react";
import { getCoords, isNumber } from "./helpers";
import { ContextTriggerConfig, Coords } from "./index.d";

enum MOUSE_BUTTON {
  LEFT = 0,
  RIGHT = 2,
}

const defaultConfig: ContextTriggerConfig = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  collect: () => {},
  disable: false,
  disableIfShiftIsPressed: false,
  holdToDisplay: {
    mouse: false,
    touch: false,
  },
  posX: 0,
  posY: 0,
};

export default function buildUseContextMenuTrigger(
  triggerVisible: (coords: Coords, data: unknown) => void
) {
  return (
    _config: Partial<ContextTriggerConfig> = {}
  ): UseContextTriggerResult => {
    const config = Object.assign({}, defaultConfig, _config);
    const holdToDisplay = Object.assign(
      {},
      defaultConfig.holdToDisplay,
      _config.holdToDisplay
    );
    const touchHandled = useRef(false);
    const mouseDownTimeoutId = useRef<number>();
    const touchstartTimeoutId = useRef<number>();

    const handleContextClick = useCallback(
      (event) => {
        if (config.disable) return;
        if (config.disableIfShiftIsPressed && event.shiftKey) return;

        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();

        triggerVisible(
          getCoords(event, [config.posX, config.posY]),
          config.collect()
        );
      },
      [config]
    );

    const handleMouseDown = useCallback(
      (event) => {
        if (
          isNumber(holdToDisplay.mouse) &&
          holdToDisplay.mouse >= 0 &&
          event.button === MOUSE_BUTTON.LEFT
        ) {
          event.persist();
          event.stopPropagation();

          mouseDownTimeoutId.current = window.setTimeout(
            () => handleContextClick(event),
            holdToDisplay.mouse as number
          );
        }
      },
      [holdToDisplay, handleContextClick]
    );

    const handleMouseUp = useCallback((event) => {
      if (event.button === MOUSE_BUTTON.LEFT) {
        clearTimeout(mouseDownTimeoutId.current!);
      }
    }, []);

    const handleTouchstart = useCallback(
      (event) => {
        touchHandled.current = false;

        if (isNumber(holdToDisplay.touch) && holdToDisplay.touch >= 0) {
          event.persist();
          event.stopPropagation();

          touchstartTimeoutId.current = window.setTimeout(() => {
            handleContextClick(event);
            touchHandled.current = true;
          }, holdToDisplay.touch as number);
        }
      },
      [handleContextClick, holdToDisplay.touch]
    );

    const handleTouchEnd = useCallback((event) => {
      if (touchHandled.current && event.cancelable) {
        event.preventDefault();
      }
      clearTimeout(touchstartTimeoutId.current!);
    }, []);

    const handleContextMenu = useCallback(
      (event) => {
        if (touchstartTimeoutId.current && !config.disable) {
          event.cancelable && event.preventDefault();
        } else {
          handleContextClick(event);
        }
      },
      [handleContextClick, config.disable]
    );

    const triggerBind: TriggerBind = {
      onContextMenu: handleContextMenu,
    };
    if (holdToDisplay.mouse !== false) {
      triggerBind.onMouseDown = handleMouseDown;
      triggerBind.onMouseUp = handleMouseUp;
      triggerBind.onMouseOut = handleMouseUp;
    }
    if (holdToDisplay.touch !== false) {
      triggerBind.onTouchStart = handleTouchstart;
      triggerBind.onTouchEnd = handleTouchEnd;
      triggerBind.onTouchCancel = handleTouchEnd;
      triggerBind.onTouchMove = handleTouchEnd;
    }

    return [triggerBind, handleContextClick];
  };
}
type TriggerBind = {
  onContextMenu: React.EventHandler<React.SyntheticEvent>;
  onMouseDown?: React.EventHandler<React.SyntheticEvent>;
  onMouseUp?: React.EventHandler<React.SyntheticEvent>;
  onMouseOut?: React.EventHandler<React.SyntheticEvent>;
  onTouchStart?: React.EventHandler<React.SyntheticEvent>;
  onTouchEnd?: React.EventHandler<React.SyntheticEvent>;
  onTouchCancel?: React.EventHandler<React.SyntheticEvent>;
  onTouchMove?: React.EventHandler<React.SyntheticEvent>;
};
export type UseContextTriggerResult = [
  TriggerBind,
  React.EventHandler<React.SyntheticEvent>
];
