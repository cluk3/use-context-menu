import React, { useState } from "react";
import ReactDOM from "react-dom";
import useContextMenu from "../src";
import Menu from "./Menu";

import "./styles.css";

const list = [
  {
    id: "0",
    name: "Lorem"
  },
  {
    id: "1",
    name: "Ipsum"
  },
  {
    id: "2",
    name: "Dolor"
  },
  {
    id: "3",
    name: "Sit"
  }
];

const ListItem = ({ name, useContextTrigger }) => {
  const [bindTrigger] = useContextTrigger({
    collect: () => name
  });
  return <li {...bindTrigger}>{name}</li>;
};

function App() {
  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { data, coords, setVisible }
  ] = useContextMenu();
  const [bindTrigger] = useContextTrigger({
    collect: () => "Title"
  });
  const [clickedCmd, setClickedCmd] = useState();
  const hideMenu = () => setVisible(false);
  return (
    <div className="App">
      <h1 {...bindTrigger}>useContextMenu</h1>
      <h2>Right click to see some magic happen!</h2>
      {clickedCmd && (
        <p>
          You clicked the <b>{clickedCmd}</b> command!
        </p>
      )}
      <ul>
        {list.map(item => (
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
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
