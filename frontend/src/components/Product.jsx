
function ProductGrid(props)
{
  return <div className='product-grid-container'>
    {props.children}
  </div>
}

function ProductTile(props)
{
  return <div className='product-grid-tile' onClick={props.onClick}>
    <img alt='Loading' src={props.src}/>
    <p className="product-tile-title-text">{props.title}</p>
    <p className="product-tile-price-text">{"$"+props.price+""}</p>
  </div>
}

export {ProductGrid, ProductTile};