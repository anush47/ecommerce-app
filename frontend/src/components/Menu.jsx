import React from 'react';
import './Menu.css';

const Menu = ({items, onMenuItemClick}) => {

    const handleMenuItemClick = (id, event) => {
        event.stopPropagation();
        if(onMenuItemClick){
            onMenuItemClick(id)
            console.log('Category in Menu : '+id);
        }
    }
    return (
        <ul className="menu">
          {items.map((item) => (
            <li key={item.id} className="menu-item" onClick={(event) => {handleMenuItemClick(item.id, event)}}>
              {item.category}
              {item.subcategories && item.subcategories.length > 0 && (
                <Menu items={item.subcategories} onMenuItemClick={onMenuItemClick}/>
              )}
            </li>
          ))}
        </ul>
      );
}

export default Menu