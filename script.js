let userWords = [];
let rankings = {};
let currentComparisonIndex = 0; // number of comparisons tracker
let totalComparisons = 0; // total number of comparisons to be made

document.getElementById("user-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") { // if "enter" key is pressed
    startWithUserWords(); // trigger start ranking function
  }
});

function startWithUserWords() {
  const input = document.getElementById("user-input").value;

  userWords = input.split(',').map(word => word.trim()).filter(word => word.length > 0); // split input by comma and trim spaces around words

  if (userWords.length < 2) { // Check if there are at least two words
    alert("Please enter at least two words.");
    return;
  }

  initializeRankings();   // initialize rankings for user words

  // start the Merge Sort to begin the ranking process
  currentComparisonIndex = 0; // reset comparison index before starting
  totalComparisons = userWords.length * (userWords.length - 1) / 2; // Calculate total comparisons
  mergeSort(userWords).then(sortedWords => {
    displayRanking(sortedWords); // display ranked list
    document.getElementById("startOverButton").style.display = "block"; // Show "Start Over" button
  });
}

function initializeRankings() {
  rankings = {};
  userWords.forEach(word => {
    rankings[word] = { wins: 0, losses: 0 }; // Initialize rankings for each word
  });
}

function displayRanking(sortedWords) {
  const rankingDiv = document.getElementById("ranking");
  rankingDiv.innerHTML = "<h2>Ranking:</h2>";
  sortedWords.forEach((word, index) => {
    rankingDiv.innerHTML += `${index + 1}. ${word}<br>`;
  });

  document.getElementById("copyButton").style.display = "block"; // Show copy button
  const progress = document.getElementById("progress");
  progress.style.width = "100%";
}

async function mergeSort(words) { // Merge Sort Implementation with minimal comparisons

  if (words.length <= 1) {
    return words;
  }

  const mid = Math.floor(words.length / 2);
  const left = words.slice(0, mid);
  const right = words.slice(mid);

  const sortedLeft = await mergeSort(left);
  const sortedRight = await mergeSort(right);

  return merge(sortedLeft, sortedRight);
}

async function merge(left, right) { // Merge two sorted sublists and rank them
  const result = [];

  while (left.length > 0 && right.length > 0) {
    const [leftWord, rightWord] = [left[0], right[0]];

    // Ask the user which word they prefer
    const userChoice = await compareWords(leftWord, rightWord);

    if (userChoice === leftWord) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }

    // Update the progress bar after each comparison
    currentComparisonIndex++;
    updateProgressBar();
  }

  // Add remaining items from left or right buttons
  return result.concat(left, right);
}

function compareWords(word1, word2) {
  return new Promise((resolve) => {
    const pairDiv = document.getElementById("word-pair");
    pairDiv.innerHTML = ""; // Clear existing buttons

    const button1 = document.createElement('button');
    button1.className = 'aa';
    button1.textContent = word1;
    button1.addEventListener('click', () => resolve(word1));

    const button2 = document.createElement('button');
    button2.className = 'aa';
    button2.textContent = word2;
    button2.addEventListener('click', () => resolve(word2));

    pairDiv.appendChild(button1);
    pairDiv.appendChild(button2);
  });
}

function resolveChoice(selectedWord) {
  const [word1, word2] = [userWords[0], userWords[1]];

  if (!rankings[word1]) rankings[word1] = { wins: 0, losses: 0 };
  if (!rankings[word2]) rankings[word2] = { wins: 0, losses: 0 };

  if (selectedWord === word1) {
    rankings[word1].wins++;
    rankings[word2].losses++;
  } else {
    rankings[word2].wins++;
    rankings[word1].losses++;
  }
}

function updateProgressBar() {
  const progress = document.getElementById("progress");
  let currentProgress = (currentComparisonIndex / totalComparisons) * 100;
  currentProgress = Math.min(currentProgress, 100);
  progress.style.width = currentProgress.toFixed(2) + '%';
}

function startOver() {  // reset everything and start the process again
  document.getElementById("ranking").innerHTML = ""; // clear previous ranking
  document.getElementById("word-pair").innerHTML = ""; // clear word pair
  // hide progress bar
  progress.style.width = "100%";
  currentComparisonIndex = 0; // reset comparison counter
  updateProgressBar(); // reset progress bar to 0%
  startWithUserWords();   // restart the ranking process with user input
}

function copyToClipboard() {
  const rankingDiv = document.getElementById("ranking");
      const rankingText = rankingDiv.innerText; 
      navigator.clipboard.writeText(rankingText)
        .then(() => {
          const copyMessage = document.getElementById('copyMessage');
          copyMessage.style.display = 'block';
          setTimeout(() => {
            copyMessage.style.display = 'none';
          }, 2000); 
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
}