

function Navbar(props) {
    return <div className='navbar'>{props.children}</div>
  }
  
  function NavItem(props){
    return <div className='nav-item'>
      {props.children}
    </div>
  }
  

  export {Navbar, NavItem};