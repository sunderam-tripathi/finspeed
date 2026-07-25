# Mako Shark rigid-fork visual pilot r01

## Scope

This is the first governed selection-dependent configurator family. It proves
that changing the Mako Shark fork from the catalog front suspension to the
rigid-fork request changes the bicycle preview in both themes.

It is **not** evidence that every configurator combination has an exact image.
The remaining component, finish, and accessory families remain explicitly
uncovered in the asset manifest until reviewed imagery exists.

## Product authority

- Exact source: `Finspeed-Upscaled-Final/01-raster-masters-4x/products/mako-shark/angle-2.png`
- Exact source SHA-256: `4F6BAD6DBEF9B3A64D01AE5973D54F5497CD8EBF17525147123811C22F6197A1`
- Product identity retained: Mako Shark frame geometry, mint/graphite finish,
  Finspeed downtube wordmark, 27.5-inch wheel proportion, mudguards, drivetrain,
  saddle, handlebar and right-facing side-profile composition.
- Intended edit: replace the front suspension assembly with a straight black
  rigid fork while leaving the rest of the bicycle unchanged.
- Authority tier: C, assisted component preview.
- Approval status: visually reviewed for local pilot use; final sellable
  component specification remains subject to Finspeed confirmation.

## Generation mode and prompts

Built-in OpenAI ImageGen was used in referenced-image edit mode with the exact
Mako Shark source attached.

Light prompt:

> Edit this exact Finspeed Mako Shark product photograph. Preserve the bicycle
> identity, frame geometry, mint and graphite paint, readable FINSPEED
> downtube wordmark, wheels, tyres, brakes, drivetrain, saddle, handlebar,
> cables, mudguards, viewing angle, proportions and all other product details.
> Change only the front suspension fork to a realistic straight black rigid
> bicycle fork. Produce a clean premium e-commerce side-profile studio
> photograph on an even white background, with the entire bicycle visible,
> level, centred, grounded, and with generous safety space. No rider, props,
> labels, extra parts, invented branding or crop.

Dark prompt:

> Using the same exact Finspeed Mako Shark reference and the approved rigid-fork
> edit, create a premium dark studio counterpart. Preserve the exact product
> identity, geometry, mint and graphite finish, readable FINSPEED wordmark,
> wheels, drivetrain, brakes, mudguards, angle and proportions. Illuminate the
> full bicycle with a restrained soft spotlight on a near-black seamless studio
> sweep. Keep the bicycle fully visible, centred and grounded. No rider, props,
> labels, glow effects, extra parts, invented branding or crop.

## Accepted sources

- `light-white-source.png`
  - SHA-256: `0CED7315AA85CB29EE8955419C1CCEEDEEFA2CB52406AB7FEE71D0421BB21BC6`
- `dark-source.png`
  - SHA-256: `A31B0641703029134D4F5E8A3EEFAC8FC1AAA3E5DC8FD66DBA7A995DC2D40F6E`

The chroma-key experiment and its derived cutouts are retained in this proof
folder as rejected working material. Browser assets are derived only from the
accepted white and dark studio sources through
`scripts/normalize-configurator-poster-pair.py`.

## Runtime contract

- Model: `mako-shark`
- SKU: `mako-shark-27-5-geared`
- State criterion: `components.fork = rigid-fork`
- Light presentation: opaque white-sweep poster with the existing stage
  `mix-blend-mode: multiply` treatment for a seamless porcelain canvas.
- Dark presentation: opaque near-black studio poster.
- Responsive widths: 480, 960, and 1600 pixels on a 3:2 canvas.

The state-specific family must win over the stock SKU image only when the
registered criterion matches. Every other state falls back to its registered
stock or fit family and remains labelled as a reference preview.
