# Branding & Logo Instructions

This project uses the Kinara brand logo and brand CSS. To ensure the UI uses the official logo and brand styles, follow these steps.

## 1) Place the official logo in `public/logo.png`
- The app references the logo as `/logo.png` from the `public/` directory.
- Place the uploaded high-resolution logo file at `public/logo.png` (do not modify, redraw, or recolor the image).

## 2) Quick copy commands
If you have the image in your Downloads folder, use one of these commands to copy it into the project `public` folder.

Windows (PowerShell):

```powershell
# Create public folder if missing, then copy the file (replace 'path\to\your\logo.png')
mkdir -Force public
Copy-Item -Path "C:\Users\$env:USERNAME\Downloads\logo.png" -Destination .\public\logo.png -Force
```

macOS / Linux:

```bash
mkdir -p public
cp ~/Downloads/logo.png public/logo.png
```

If your downloaded file has a different name, replace `logo.png` with the actual filename.

## 3) Recommended: favicons
Use the same high-resolution logo to generate favicons and place them in `public/` (optional).

## 4) What I changed in the codebase
- `src/styles/index.css` now imports `src/styles/kinara-brand.css` so brand tokens apply globally.
- The header and footer now reference `/logo.png` and use the Kinara brand name.
- `src/app/components/ProductCard.tsx` updated to use brand colors, rounded card, soft shadows, gold accents, and an optional `onAddToCart` prop.

If you'd like, I can also:
- Copy the uploaded image into `public/logo.png` for you (if you provide the file path inside the workspace).
- Generate a set of favicons from the provided logo.
- Continue styling additional components to better match the Kinara design system.
