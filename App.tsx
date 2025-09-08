<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Skincare Advisor</title>

    <!-- GLOBAL SCROLL LOCK + header offset -->
    <style>
      html, body, #root { height: 100%; overflow: hidden; }
      html { scroll-padding-top: 56px; } /* header 56px (h-14) */
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
              'brand-primary': { DEFAULT: '#2563eb', hover: '#1d4ed8', light: '#3b82f6' },
              'brand-secondary': '#db2777',
              'brand-text-main': '#1e293b',
              'brand-text-muted': '#64748b',
              'brand-text-inverted': '#cbd5e1',
              'brand-bg': '#f1f5f9',
              'brand-surface': '#ffffff',
              'brand-dark': '#0f172a'
            },
            boxShadow: {
              'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              'lifted': '0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -4px rgba(15, 23, 42, 0.07)'
            }
          }
        }
      }
    </script>

    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.1.0",
        "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
        "react/": "https://esm.sh/react@^19.1.0/",
        "@google/genai": "https://esm.sh/@google/genai@^1.10.0"
      }
    }
    </script>
  </head>

  <body class="bg-brand-bg font-sans text-brand-text-main">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
