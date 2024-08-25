import React, {useState} from 'react';

const ActionButton = ({
  width = "100px",
  height = "80px",
  onTap,
  buttonText,
  outlinedMode = false,
  isSelected = false,
  backgroundColor,
  outlineColor,
  insidePadding = "5px",
  fontSize = "20pt",
  margin = "0"
}) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
      setIsHovered(true);
  };

  const handleMouseLeave = () => {
    
      setIsHovered(false);
    
  };

  var defaultBg = 'var(--main-blue)';
  var bg = backgroundColor || defaultBg;

  return (
    <div
      onClick={onTap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: `${insidePadding}`,
        height: `${height}`,
        width: `${width}`,
        backgroundColor: !outlinedMode ? bg : isSelected ? bg : isHovered ? bg : 'white',
        borderRadius: '5px',
        border: `2px solid ${isHovered ? 'transparent' : (outlinedMode ? (outlineColor || defaultBg) : 'transparent')}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: `${margin}`
      }}
    >
      <span
        style={{
          fontSize: `${fontSize}`,
          color: isHovered ? 'white' : (outlinedMode ? (outlineColor || defaultBg) : 'white'),
          fontWeight: '500',
        }}
      >
        {buttonText}
      </span>
    </div>
  );
};

export default ActionButton;
