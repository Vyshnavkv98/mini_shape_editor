
import { useState, useRef, useEffect } from 'react';
import './RectangleShapeEditor.module.css';


const canvas = {
    width: 700,
    height: 600
  };

  const [rectangles, setRectangles] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [startPos, setStartPos] = useState({ mouseX: 0, mouseY: 0, rectX: 0, rectY: 0 });

  const canvasRef = useRef(null);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function generateRandomRectangles() {
    const x = Math.floor(Math.random() * (canvas.width - 50));
    const y = Math.floor(Math.random() * (canvas.height - 50));
    const height = Math.floor(Math.random() * (canvas.height - y));
    const width = Math.floor(Math.random() * (canvas.width - x));

    const newRect = { x, y, width, height, color: getRandomColor() };
    console.log(newRect);

    setRectangles((prev) => [...prev, newRect]);
  }

  function addShape() {
    generateRandomRectangles();
  }

  function handleMouseDown(e, index) {
    const rect = rectangles[index];
    const canvasRect = canvasRef.current.getBoundingClientRect();
    console.log(canvasRect, 'canvasRect');
    setStartPos({
      mouseX: e.clientX - canvasRect.left,
      mouseY: e.clientY - canvasRect.top,
      rectX: rect.x,
      rectY: rect.y
    });
    setDraggingIndex(index);
  }

  function handleMouseMove(e) {
    if (draggingIndex === null) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - canvasRect.left) - startPos.mouseX;
    const deltaY = (e.clientY - canvasRect.top) - startPos.mouseY;

    setRectangles((prev) =>
      prev.map((rect, index) => {
        if (index === draggingIndex) {
          return {
            ...rect,
            x: Math.max(0, Math.min(canvas.width - rect.width, startPos.rectX + deltaX)),
            y: Math.max(0, Math.min(canvas.height - rect.height, startPos.rectY + deltaY)),
          };
        }
        return rect;
      })
    );
  }

  function handleMouseUp() {
    setDraggingIndex(null);
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      <div className='heading'>
        <h2 className='headingPara'>Mini shape editor</h2>
      </div>
      <div className='parent' style={{ width: '100vw', height: 'auto' }}>
        <div className='parentCanvas'>
          <div className='buttons'>
            <button onClick={addShape}>Add Shape</button>
            <button onClick={() => console.log(JSON.stringify(rectangles, null, 2))}>Print JSON</button>
          </div>
          <div className='canvas' id='canvas' ref={canvasRef}>
            {rectangles.map((rect, index) => (
              <div
                key={index}
                onMouseDown={(e) => handleMouseDown(e, index)}
                style={{
                  position: 'absolute',
                  left: `${rect.x}px`,
                  top: `${rect.y}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                  backgroundColor: rect.color,
                  cursor: 'grab',
                }}
                draggable="false" // Disable default drag behavior
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
