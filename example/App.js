import React, { useState } from "react";
import ReactDOM from "react-dom";
import useContextMenu from "../src";
import Menu from "./Menu";

import "./styles.css";

const list = [
  {
    id: "0",
    name: "Lorem",
  },
  {
    id: "1",
    name: "Ipsum",
  },
  {
    id: "2",
    name: "Dolor",
  },
  {
    id: "3",
    name: "Sit",
  },
];

const ListItem = ({ name, useContextTrigger }) => {
  const [bindTrigger] = useContextTrigger({
    collect: () => name,
  });
  return <li {...bindTrigger}>{name}</li>;
};

function App() {
  const [isMenuEnabled, setMenuEnabled] = useState(true);

  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { data, coords, hideMenu },
  ] = useContextMenu();
  const [bindTitleTrigger] = useContextTrigger({
    collect: () => "Title",
    disable: !isMenuEnabled,
    holdToDisplay: { touch: 1000 },
  });
  const [bindSubtitleTrigger] = useContextTrigger({
    collect: () => "subTitle",
    holdToDisplay: {
      mouse: 1000,
    },
  });
  const [clickedCmd, setClickedCmd] = useState();

  return (
    <div className="App">
      <h1 {...bindTitleTrigger}>useContextMenu</h1>
      <h2 {...bindSubtitleTrigger}>Right click to see some magic happen!</h2>
      {clickedCmd && (
        <p>
          You clicked the <b>{clickedCmd}</b> command!
        </p>
      )}
      <ul>
        {list.map((item) => (
          <ListItem
            useContextTrigger={useContextTrigger}
            name={item.name}
            key={item.id}
          />
        ))}
      </ul>
      <Menu
        bindMenu={bindMenu}
        data={data}
        bindMenuItem={bindMenuItem}
        coords={coords}
        setClickedCmd={setClickedCmd}
        hideMenu={hideMenu}
      />
      <label htmlFor="titleToggle">Toggle title context menu</label>
      <input
        id="titleToggle"
        type="checkbox"
        checked={isMenuEnabled}
        onChange={() => setMenuEnabled((x) => !x)}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
