document.addEventListener('DOMContentLoaded', () => {
  const difficultySelect = document.getElementById('difficulty');
  const distanceInput = document.getElementById('distance-input');
  const addDistanceButton = document.getElementById('add-distance');
  const totalDistanceSpan = document.getElementById('total-distance');
  const piecesUnlockedSpan = document.getElementById('pieces-unlocked');
  const totalPiecesSpan = document.getElementById('total-pieces');
  const startButton = document.getElementById('start-puzzle');

  let totalDistance = 0;
  let totalPieces = 16;
  let distanceToUnlock = 5; 

  const images = ['image1', 'image2', 'image3']; 
  const selectedImage = images[Math.floor(Math.random() * images.length)];
  sessionStorage.setItem('selectedImage', selectedImage); 

  console.log('Randomly selected image:', selectedImage); 

  totalPiecesSpan.textContent = totalPieces;
  piecesUnlockedSpan.textContent = `0`;
  distanceToUnlock = 5; 

  
  difficultySelect.addEventListener('change', (e) => {
      const difficulty = e.target.value;
      if (difficulty === 'easy') {
          totalPieces = 16;
          distanceToUnlock = 5; 
      } else if (difficulty === 'normal') {
          totalPieces = 36;
          distanceToUnlock = 10; 
      } else if (difficulty === 'hard') {
          totalPieces = 64;
          distanceToUnlock = 15; 
      }

      totalPiecesSpan.textContent = totalPieces;
      piecesUnlockedSpan.textContent = `0`;
  });

  
  addDistanceButton.addEventListener('click', () => {
      const distance = parseFloat(distanceInput.value);
      if (isNaN(distance) || distance <= 0) {
          alert('Please enter a valid distance.');
          return;
      }

      totalDistance += distance;
      totalDistanceSpan.textContent = totalDistance.toFixed(2);

      const unlockRate = totalDistance / distanceToUnlock; 
      const unlockedPieces = Math.min(totalPieces, Math.floor(unlockRate * totalPieces));
      piecesUnlockedSpan.textContent = unlockedPieces;

      if (unlockedPieces === totalPieces) {
          startButton.classList.remove('hidden');
      }
  });

  startButton.addEventListener('click', () => {
      sessionStorage.setItem('totalPieces', totalPieces);
      console.log('Starting puzzle with:', { selectedImage, totalPieces });
      window.location.href = 'puzzle.html';
  });
});
