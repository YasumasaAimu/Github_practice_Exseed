document.addEventListener('DOMContentLoaded', () => {
  const selectedImage = sessionStorage.getItem('selectedImage'); 
  const totalPieces = parseInt(sessionStorage.getItem('totalPieces'), 10);

  if (!selectedImage || isNaN(totalPieces)) {
      alert('No image or puzzle settings found. Please go back to the main page.');
      window.location.href = 'index.html';
      return;
  }

  const img = new Image();
  img.src = `assets/images/${selectedImage}.jpg`;

  img.onload = () => {
      createPuzzle(img, totalPieces);
  };

  img.onerror = () => {
      console.error(`Failed to load image: ${img.src}`);
      alert('Failed to load the puzzle image.');
  };
});


function createPuzzle(image, pieces) {
  const container = document.getElementById('puzzle-container');
  container.innerHTML = ''; 

  const pieceSize = Math.sqrt(pieces); 
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const pieceWidth = containerWidth / pieceSize;
  const pieceHeight = containerHeight / pieceSize;

  const positions = [];
  const shuffledPositions = [];

  for (let y = 0; y < pieceSize; y++) {
      for (let x = 0; x < pieceSize; x++) {
          positions.push({ x, y }); 
          shuffledPositions.push({ x, y });
      }
  }


  shuffledPositions.sort(() => Math.random() - 0.5);

  shuffledPositions.forEach((pos, index) => {
      const correctPos = positions[index];
      const canvas = document.createElement('canvas');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
          image,
          correctPos.x * (image.width / pieceSize),
          correctPos.y * (image.height / pieceSize),
          image.width / pieceSize,
          image.height / pieceSize,
          0,
          0,
          pieceWidth,
          pieceHeight
      );

      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.setAttribute('draggable', 'true');
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
      piece.style.position = 'absolute';
      piece.style.left = `${pos.x * pieceWidth}px`;
      piece.style.top = `${pos.y * pieceHeight}px`;
      piece.dataset.correctX = correctPos.x;
      piece.dataset.correctY = correctPos.y;

      piece.addEventListener('dragstart', onDragStart);
      piece.addEventListener('dragover', onDragOver);
      piece.addEventListener('drop', onDrop);

      container.appendChild(piece);
  });
}

function onDragStart(e) {
  const piece = e.target;
  e.dataTransfer.setData('text/plain', JSON.stringify({
      x: piece.style.left,
      y: piece.style.top
  }));
}

function onDragOver(e) {
  e.preventDefault(); 
}

function onDrop(e) {
  e.preventDefault();
  const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
  const draggedPiece = Array.from(document.getElementsByClassName('piece')).find(piece =>
      piece.style.left === draggedData.x && piece.style.top === draggedData.y
  );

  const targetPiece = e.target;

  
  const tempLeft = targetPiece.style.left;
  const tempTop = targetPiece.style.top;
  targetPiece.style.left = draggedData.x;
  targetPiece.style.top = draggedData.y;
  draggedPiece.style.left = tempLeft;
  draggedPiece.style.top = tempTop;

  
  checkCompletion();
}

function checkCompletion() {
  const pieces = document.getElementsByClassName('piece');
  let completed = true;

  Array.from(pieces).forEach(piece => {
      
      const correctX = parseInt(piece.dataset.correctX, 10);
      const correctY = parseInt(piece.dataset.correctY, 10);

     
      const currentX = Math.round(parseInt(piece.style.left, 10) / piece.offsetWidth);
      const currentY = Math.round(parseInt(piece.style.top, 10) / piece.offsetHeight);

     
      if (correctX !== currentX || correctY !== currentY) {
          completed = false;
      }
  });

  
  if (completed) {
      setTimeout(() => {
          alert('パズルがコンプリートされました！');
      }, 100); 
  }
}

