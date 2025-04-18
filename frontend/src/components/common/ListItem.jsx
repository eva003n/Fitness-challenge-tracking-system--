import React from "react";

function ListItem({ ...props }) {
  return <li {...props}>
    {props.children}
  </li>;
}

export default ListItem;
