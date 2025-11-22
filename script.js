// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Theme toggling with light/dark palettes
    const themeToggle = document.getElementById("themeToggle");
    const themeToggleLabel = themeToggle?.querySelector(".theme-toggle-label");
    const root = document.documentElement;
    const storageKey = "preferred-theme";
    const prefersLightQuery = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: light)") : null;
    const prefersReducedMotionQuery = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    const applyTheme = (theme, { persist = false } = {}) => {
        const normalized = theme === "light" ? "light" : "dark";
        root.setAttribute("data-theme", normalized);

        if (themeToggle) {
            themeToggle.dataset.mode = normalized;
            const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
            if (themeToggleLabel) {
                themeToggleLabel.textContent = label;
            }
            const nextTheme = normalized === "light" ? "dark" : "light";
            themeToggle.setAttribute("aria-label", `Activate ${nextTheme} mode`);
        }

        if (persist) {
            try {
                localStorage.setItem(storageKey, normalized);
            } catch (error) {
                console.warn("Unable to persist theme preference:", error);
            }
        }
    };

    const storedTheme = (() => {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            console.warn("Unable to access stored theme preference:", error);
            return null;
        }
    })();

    const initialTheme = storedTheme ?? (prefersLightQuery?.matches ? "light" : "dark");
    applyTheme(initialTheme, { persist: Boolean(storedTheme) });

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
            const next = current === "light" ? "dark" : "light";
            applyTheme(next, { persist: true });
        });
    }

    const handleSystemThemeChange = (event) => {
        const hasStoredPreference = (() => {
            try {
                return Boolean(localStorage.getItem(storageKey));
            } catch {
                return false;
            }
        })();
        if (hasStoredPreference) return;
        applyTheme(event.matches ? "light" : "dark");
    };

    if (prefersLightQuery?.addEventListener) {
        prefersLightQuery.addEventListener("change", handleSystemThemeChange);
    } else if (prefersLightQuery?.addListener) {
        prefersLightQuery.addListener(handleSystemThemeChange);
    }

    // Scroll reveal animations
    const revealElements = document.querySelectorAll("[data-reveal]");
    const setRevealDelay = (element) => {
        const delay = Number(element.dataset.revealDelay);
        if (!Number.isNaN(delay)) {
            element.style.setProperty("--reveal-delay", `${delay}ms`);
        }
    };

    const showRevealsImmediately = () => {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    };

    let revealObserver = null;
    const createRevealObserver = () => new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    const stopRevealObserver = () => {
        revealObserver?.disconnect();
        revealObserver = null;
    };

    const startRevealObserver = () => {
        if (!("IntersectionObserver" in window)) {
            showRevealsImmediately();
            return;
        }
        stopRevealObserver();
        revealObserver = createRevealObserver();
        revealElements.forEach((element) => {
            if (!element.classList.contains("is-visible")) {
                revealObserver?.observe(element);
            }
        });
    };

    if (revealElements.length) {
        revealElements.forEach(setRevealDelay);

        if (prefersReducedMotionQuery?.matches) {
            showRevealsImmediately();
        } else {
            startRevealObserver();
        }

        const handleMotionPreferenceChange = (event) => {
            if (event.matches) {
                stopRevealObserver();
                showRevealsImmediately();
            } else {
                startRevealObserver();
            }
        };

        if (prefersReducedMotionQuery?.addEventListener) {
            prefersReducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
        } else if (prefersReducedMotionQuery?.addListener) {
            prefersReducedMotionQuery.addListener(handleMotionPreferenceChange);
        }
    }

    // Parallax accents
    const parallaxNodes = document.querySelectorAll("[data-parallax]");
    let parallaxRAF = null;
    let parallaxActive = false;

    const updateParallax = () => {
        const scrollY = window.scrollY;
        parallaxNodes.forEach((node) => {
            const speed = Number(node.dataset.parallax) || 0.15;
            const offset = scrollY * speed * -1;
            node.style.setProperty("--parallax-offset", `${offset}px`);
        });
        parallaxRAF = null;
    };

    const scheduleParallax = () => {
        if (parallaxRAF !== null) return;
        parallaxRAF = requestAnimationFrame(updateParallax);
    };

    const disableParallax = () => {
        if (parallaxActive) {
            window.removeEventListener("scroll", scheduleParallax);
            parallaxActive = false;
        }
        if (parallaxRAF !== null) {
            cancelAnimationFrame(parallaxRAF);
            parallaxRAF = null;
        }
        parallaxNodes.forEach((node) => {
            node.style.setProperty("--parallax-offset", "0px");
        });
    };

    const enableParallax = () => {
        if (parallaxActive || !parallaxNodes.length) return;
        parallaxActive = true;
        updateParallax();
        window.addEventListener("scroll", scheduleParallax, { passive: true });
    };

    if (parallaxNodes.length) {
        if (prefersReducedMotionQuery?.matches) {
            disableParallax();
        } else {
            enableParallax();
        }

        const handleParallaxPreferenceChange = (event) => {
            if (event.matches) {
                disableParallax();
            } else {
                enableParallax();
            }
        };

        if (prefersReducedMotionQuery?.addEventListener) {
            prefersReducedMotionQuery.addEventListener("change", handleParallaxPreferenceChange);
        } else if (prefersReducedMotionQuery?.addListener) {
            prefersReducedMotionQuery.addListener(handleParallaxPreferenceChange);
        }
    }

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
            const prefersReducedMotion = prefersReducedMotionQuery?.matches;
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
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
            "Your time is limited, so don’t waste it living someone else’s life.",
            "The only way to do great work is to love what you do.",
            
        ];
        quoteButton.addEventListener("click", () => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteDisplay.textContent = quotes[randomIndex];
        });
    }
    
});