function togglePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  }
  // Function to toggle navigation
function toggleNav() {
  var nav = document.getElementById("headerNav");
  nav.style.display === "block" ? nav.style.display = "none" : nav.style.display = "block";
}
document.addEventListener('DOMContentLoaded', function(){

  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  }

  searchClose.addEventListener('click', function() {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  });


});



document.addEventListener('DOMContentLoaded', () => {
  const chatHistory = document.getElementById('chat-history');
  const userInput = document.getElementById('user-input');
  const form = document.getElementById('chat-form');
  const loader = document.getElementById('loader');

  async function sendMessage(message) {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), // Send the message in the request body
      });

      const data = await response.json();
      const botMessage = data.response;

      // Add chat message to the chat history
      chatHistory.innerHTML += `<div class="user-message">${message}</div>`;
      chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

      // Scroll to the bottom of the chat history
      chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
      loader.style.display = 'block'; // Show the loader
      await sendMessage(userMessage);
      loader.style.display = 'none'; // Hide the loader after the message is sent
      userInput.value = ''; // Clear the input field
    }
  });
});
