import React from "react";

function StockTable({ data }) {
  const headers = ["ID", "Name", "Price", "Stock"];

  const rows = [...Array(30).keys()];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        msOverflowStyle: "none",
      }}
    >
      <div>
        <StockTableHead>
          {headers.map((element, index) => (
            <TableCell key={index} fontColor="white">
              {element}
            </TableCell>
          ))}
        </StockTableHead>
      </div>
      <div style={{ overflowY: "scroll", height: "100%" }}>
        {rows.map((element, index) => (
          <TableRow
            key={index}
            backgroundColor={index % 2 === 0 ? "#e7f0f9" : "#a5c5ea"}
          >
            {headers.map((element, index) => (
            <TableCell key={index} fontColor="white">
              {element}
            </TableCell>
          ))}
          </TableRow>
        ))}
      </div>
    </div>
  );
}

function StockTableHead(props) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "60px",
        height: "80px",
        display: "flex",
        backgroundColor: "var(--main-blue)",
        justifyContent: "space-around",
      }}
    >
      {props.children}
    </div>
  );
}

function TableCell(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: `${props.fontColor || "black"}`,
        fontSize: `${props.fontSize || "18pt"}`,
        fontWeight: "500",
      }}
    >
      {props.children}
    </div>
  );
}

function TableRow(props) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        height: "75px",
        minHeight: "55px",
        backgroundColor: `${props.backgroundColor}`,
      }}
    >{props.children}</div>
  );
}

export default StockTable;
