import React from "react";

export function TableCell(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: `${props.fontColor || "black"}`,
        fontSize: `${props.fontSize || "18pt"}`,
        fontWeight: "500",
        width : `${props.width || 'auto'}`
      }}
    >
      {props.children}
    </div>
  );
}

export function TableRow(props) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        height: "65px",
        minHeight: "55px",
        backgroundColor: `${props.backgroundColor}`,
      }}

      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export function TableHead(props) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "60px",
        height: "70px",
        display: "flex",
        backgroundColor: "var(--main-blue)",
        justifyContent: "space-around",
      }}
      
    >
      {props.children}
    </div>
  );
}
