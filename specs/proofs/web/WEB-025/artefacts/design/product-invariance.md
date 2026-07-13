# Product invariance

- Official source: `apps/web/public/assets/products/cutouts/mako-shark.png`
- Official SHA-256: `1d9fb70ee4cebb34cd7b99681842b0b56a02027696364aa30be6b60c96e26d9a`
- No-floor baseline SHA-256: `203b4b864bfb3c84f264ce34e6005cb2f9a924ef039a4ca3e29c0bcff71dced3`
- Scene-matched proof SHA-256: `9c315a46239a98e5b6969ac2ee0ff9e09a431cd2c607f7fccf901012b73fb680`

The no-floor baseline and the scene-matched product are both 1200 × 900 RGBA images. Their alpha channels are byte-for-byte identical: zero silhouette pixels changed. Bicycle geometry, branding, component placement, frame proportions, and product orientation therefore remain invariant.

All 161,467 visible pixels receive a photographic exposure correction. Chromatic pixels keep their channel ratios and therefore retain the mint frame and yellow accent identity. Neutral rubber, metal, spokes, and boundary contamination receive stronger highlight compression plus a very small cool ambient reflection so the supplied studio photograph shares the environment's light. ImageGen is used only for the empty environment.

The final presentation scales the complete product uniformly without warping: 90% for desktop and 75% for mobile. Wheel-specific contact shadows are placed behind the product and do not alter product pixels.
