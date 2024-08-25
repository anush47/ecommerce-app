import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableCell, TableRow, TableHead } from "../tables/TableComponents";

const baseUrl = "http://127.0.0.1:5000";

function QuartelySalesReports() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/orders/years`)
      .then((response) => {
        console.log(response.data);
        setYears(response.data);
        if (response.data.length > 0) {
          setSelectedYear(response.data[0]);
        }
      })
      .catch((error) => {
        alert("Something went wrong");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedYear) {
      axios
        .post(`${baseUrl}/api/reports/quartely-sales`, {
          selectedYear: selectedYear,
        })
        .then((response) => {
          setSalesData(response.data);
        })
        .catch((error) => {
          alert("Something went wrong!");
          console.error(error);
        });
    }
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "30px",
      }}
    >
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom : '20px' }}>
        Quarterly Sales Report
      </p>
      <div style={{ display: "flex", flexDirection: "column", width: "150px" }}>
        <label style={{ fontSize: "20pt", marginBottom : '10px' }} htmlFor="year-select">
          Select Year:
        </label>
        <select
          className="select-box"
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <TableHead>
          <TableCell fontColor='white' width='calc(100%/3)'>Year</TableCell>
          <TableCell fontColor='white' width='calc(100%/3)'>Quarter</TableCell>
          <TableCell fontColor='white' width='calc(100%/3)'>Total Sales</TableCell>
        </TableHead>
        {salesData.map((data, index) => {
          return (
            <TableRow key={index}>
              <TableCell width='calc(100%/3)'>{data.sales_year}</TableCell>
              <TableCell width='calc(100%/3)'>{data.quarter}</TableCell>
              <TableCell width='calc(100%/3)'>{data.total_sales}</TableCell>
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}

export default QuartelySalesReports;
