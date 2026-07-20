# Red Snapper 24-inch IBC visual - revision 01

## Authority and generation

- SKU: `red-snapper-24-ibc`
- Fidelity tier: **C, AI-assisted catalog variant**
- Built-in tool: OpenAI ImageGen image edit
- Accepted light output: `exec-3e36f66c-94c7-43d7-8563-804fbd9ae58c.png`
- Prompt intent: preserve the verified Red Snapper exactly and add only the catalogued frame-mounted IBC rear carrier; no crop, zoom, rotation, recolor, wheel change, component substitution, rewritten decal, person, or unrelated accessory.
- Product source SHA-256: `B3A2A0FE498C88B1BFF75A205F6C7271B1E44E9BF85A97AD7A4AD0852696B0BE`
- Carrier construction reference SHA-256: `FFA1D17F7061916484410D750E09E56141C00DDA2515685BA9D08E5820C0A8F5`

The separately generated pilot dark image was not used in production. Light/dark parity is deterministic: the accepted light cutout is placed over the same studio sweep and graded by `scripts/normalize-configurator-variant.py` (SHA-256 `CBC3AE97276BD8D6584F41A3607F8344729E9090C5F63E103A7C75B9FEC45B75`).

## Masters

| Master | SHA-256 |
| --- | --- |
| `light-master-3072x2048.png` | `309F4D189898BB0D75408D2535CA2AB26C147E1541861CC13888D33661211D80` |
| `light-cutout-master-3072x2048.webp` | `211BF2351A82C5C9FDAF088BE3651A6146CDDFADCAB5879531DAF4DF153CE7F9` |
| `dark-master-3072x2048.png` | `B49E89132D0E25FF2E2157A5908FA10B8BDCA0D22F279A96F1FE11F2F844916A` |

Review status: accepted as a configurator catalog study. Product-owner sign-off remains required for documentary carrier construction, mounting points, decals, and final production use. Responsive hashes and measured bounds are registered in the manifest.
