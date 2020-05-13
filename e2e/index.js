import React from "react";
import useContextMenu from "../src";

export default function ContextMenuWrapper({ menuConfig, triggerConfig }) {
  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { coords },
  ] = useContextMenu(menuConfig);
  const [bindTrigger] = useContextTrigger(triggerConfig);

  return (
    <div>
      <div>outside</div>
      <h1 data-testid="trigger" {...bindTrigger}>
        useContextMenu
      </h1>

      <div data-testid="contextMenu" {...bindMenu}>
        <p>
          <span>Click coords: {JSON.stringify(coords)}</span>
        </p>
        <p data-testid="contextMenuItem" {...bindMenuItem}>
          Context menu opened
        </p>
      </div>
    </div>
  );
}
