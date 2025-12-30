// Let's keep the email address a secret.
        document.addEventListener("DOMContentLoaded", function() {
            let encodedUser = "aGVsbG8=";
            let encodedDomain = "bm9vcm1vaGFtbWFkc2lhbS5jb20=";
            let user = atob(encodedUser);
            let domain = atob(encodedDomain);
            document.getElementById("email").innerHTML = user + "@" + domain;
        });


        // Auto-update copyright year
        document.getElementById("current-year").textContent = new Date().getFullYear();

        // Theme Switcher
        const themes = ['light', 'dark', 'neo-brutalism'];
        const themeIcons = {
            'light': '☀️',
            'dark': '🌙',
            'neo-brutalism': '⚡'
        };
        let currentThemeIndex = 0;

        function setTheme(theme) {
            const body = document.body;
            const button = document.getElementById('theme-toggle');
            
            // Remove all theme classes
            body.classList.remove('dark-theme', 'neo-brutalism');
            
            // Add the selected theme class
            if (theme === 'dark') {
                body.classList.add('dark-theme');
            } else if (theme === 'neo-brutalism') {
                body.classList.add('neo-brutalism');
            }
            
            // Update button icon
            button.textContent = themeIcons[theme];
            button.title = theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ') + ' Theme';
            
            // Save preference
            localStorage.setItem('theme', theme);
            currentThemeIndex = themes.indexOf(theme);
        }

        function cycleTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            setTheme(themes[currentThemeIndex]);
        }

        // Load saved theme on page load
        window.addEventListener('load', function() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
        });
