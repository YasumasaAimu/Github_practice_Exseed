export function generatePath(x, y, width, height, gridSize) {
    const curveSize = Math.min(width, height) / 4;
    const top = y === 0
      ? `M 0 0 H ${width}`
      : `M 0 0 c ${curveSize / 2} -${curveSize}, ${width - curveSize / 2} -${curveSize}, ${width} 0`;
    const right = x === gridSize - 1
      ? `V ${height}`
      : `V ${height} c ${curveSize / 2} ${curveSize}, ${curveSize / 2} ${curveSize}, 0 ${curveSize}`;
    const bottom = y === gridSize - 1
      ? `H 0`
      : `H ${width} c -${curveSize / 2} ${curveSize}, -${width - curveSize / 2} ${curveSize}, 0 0`;
    const left = x === 0
      ? `Z`
      : `V ${curveSize} c -${curveSize / 2} -${curveSize}, -${curveSize / 2} -${curveSize}, 0 -${curveSize} Z`;
  
    return `${top} ${right} ${bottom} ${left}`;
  }
      