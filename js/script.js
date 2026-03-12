// ============================
// Theme Preference Cascade
// ============================

const button = document.querySelector("[data-theme-toggle]");
const html = document.documentElement;

function calculateTheme({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }

    if (systemSettingDark.matches) {
        return "dark";
    }

    return "light";
}

const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentTheme = calculateTheme({
    localStorageTheme,
    systemSettingDark
});

// Apply theme on load
html.setAttribute("data-theme", currentTheme);
updateButton(currentTheme);

// Toggle theme
button.addEventListener("click", () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    currentTheme = newTheme;
    updateButton(newTheme);
});

// Update icon + aria label
function updateButton(theme) {
    if (theme === "dark") {
        button.textContent = "🌙";
        button.setAttribute("aria-label", "Change to light theme");
    } else {
        button.textContent = "☀️";
        button.setAttribute("aria-label", "Change to dark theme");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));

});
