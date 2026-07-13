# Official Mako Shark invariance

- Source: `apps/web/public/assets/products/cutouts/mako-shark.png`
- Source dimensions: 1200 x 900 RGBA
- Source SHA-256: `1d9fb70ee4cebb34cd7b99681842b0b56a02027696364aa30be6b60c96e26d9a`
- Removed region: the elongated neutral studio-floor residue fitted to `y = -0.1955487397x + 834.0808193`, constrained to x=286..952 and the local floor band.
- Removed pixels: 17,107
- Removed-pixel bounding box: x=298..938, y=629..779
- Invariance check: every source RGBA pixel outside the removal mask is exactly unchanged.
- Desktop composition: pasted at native 1:1 size with no resampling, recoloring, redrawing, or generative editing.
- Mobile composition: pasted at native 1:1 size with no resampling, recoloring, redrawing, or generative editing.

The removed pixels are the old studio-ground sweep, not bicycle geometry. Dark tire pixels and chromatic frame pixels were protected by the spatial/chroma/brightness mask.
