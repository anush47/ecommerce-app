import React, {useState} from 'react';
import "./Dashboard.css";
import Sidebar from './Sidebar';
import QuartelySalesReports from './content/QuartelySalesReports';
import TopSellingProduct from './content/TopSellingProduct';
import MostOrderedCategory from './content/MostOrderedCategory';
import PeakInterestPeriod from './content/PeakInterestPeriod';
import Customers from './content/Customers';
import Orders from './content/Orders';


function Dashboard() {


  const [selectedIndex, setSelectedIndex] = useState("1");

  const handleSelectedIndexChange = (newIndex) => {
    setSelectedIndex(newIndex);
  };

  return (
    <div className='main-container'>
      <div className='app-bar-container'></div>
      <Sidebar  indexCallback={handleSelectedIndexChange}/>
      <div className='content-container'>
        {selectedIndex === "1" && (<QuartelySalesReports />)}
        {selectedIndex === "2" && (<TopSellingProduct />)}
        {selectedIndex === "3" && (<MostOrderedCategory />)}
        {selectedIndex === "4" && (<PeakInterestPeriod />)}
        {selectedIndex === "5" && (<Customers />)}
        {selectedIndex === "6" && (<Orders />)}
      </div>
    </div>
  )
}

export default Dashboard