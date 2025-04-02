// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Example: Add functionality to a button
    const button = document.getElementById("myButton");
    if (button) {
        button.addEventListener("click", () => {
            alert("Button clicked!");
        });
    }

    // Example: Dynamically update content
    const heading = document.getElementById("mainHeading");
    if (heading) {
        heading.textContent = "Welcome to My Portfolio!";
    }

    // Example: Toggle dark mode
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
        });
    }

    // Example: Display current date
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
        const currentDate = new Date().toLocaleDateString();
        dateElement.textContent = `Today's Date: ${currentDate}`;
    }

    // Example: Form submission handling
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form from refreshing the page
            alert("Form submitted successfully!");
        });
    }

    // New Feature: Scroll to top button
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // New Feature: Character counter for a textarea
    const messageInput = document.getElementById("messageInput");
    const charCounter = document.getElementById("charCounter");
    if (messageInput && charCounter) {
        messageInput.addEventListener("input", () => {
            const maxLength = 200;
            const currentLength = messageInput.value.length;
            charCounter.textContent = `${currentLength}/${maxLength} characters`;
            if (currentLength > maxLength) {
                charCounter.style.color = "red";
            } else {
                charCounter.style.color = "black";
            }
        });
    }

    // New Feature: Random quote generator
    const quoteButton = document.getElementById("quoteButton");
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quoteButton && quoteDisplay) {
        const quotes = [
            "The best way to predict the future is to invent it.",
            "Life is 10% what happens to us and 90% how we react to it.",
            "Success is not the key to happiness. Happiness is the key to success.",
            "Your time is limited, so don’t waste it living someone else’s life."
        ];
        quoteButton.addEventListener("click", () => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteDisplay.textContent = quotes[randomIndex];
        });
    }
});