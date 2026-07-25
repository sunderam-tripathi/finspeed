#!/usr/bin/env node

import {
  configuratorCatalog,
  createDefaultBuild,
  optionsForStage,
  resolveBuild,
  selectBuildOption,
} from '../apps/web/src/design/data/configurator.js';

const THEMES = ['light', 'dark'];
const WIDTHS = [480, 960, 1600];

function availableOptions(stageId, build) {
  return optionsForStage(stageId, build).filter((option) => option.available !== false);
}

function setupGroups(build) {
  const groups = new Map();
  for (const option of availableOptions('ride-setup', build)) {
    const values = groups.get(option.group) || [];
    values.push(option);
    groups.set(option.group, values);
  }
  return [...groups.entries()];
}

function crossProduct(groups, index = 0, selected = []) {
  if (index >= groups.length) return [selected];
  const [, options] = groups[index];
  return options.flatMap((option) => crossProduct(groups, index + 1, [...selected, option]));
}

function enumerateModel(model) {
  const initial = createDefaultBuild({ modelId: model.id });
  const fits = availableOptions('fit', initial);
  const componentSets = crossProduct(setupGroups(initial));
  const finishes = availableOptions('finish', initial);
  const accessories = availableOptions('accessories', initial);
  const states = new Map();

  for (const fit of fits) {
    for (const components of componentSets) {
      for (const finish of finishes) {
        for (const accessory of accessories) {
          let build = selectBuildOption(initial, 'fit', fit.id);
          for (const component of components) {
            build = selectBuildOption(build, 'ride-setup', component.id, component.group);
          }
          build = selectBuildOption(build, 'finish', finish.id);
          build = selectBuildOption(build, 'accessories', accessory.id);
          const resolved = resolveBuild(build);
          if (states.has(resolved.visualStateId)) {
            throw new Error(`Duplicate visual state for ${model.id}: ${resolved.visualStateId}`);
          }
          states.set(resolved.visualStateId, {
            fit: fit.id,
            components: Object.fromEntries(components.map((component) => [component.group, component.id])),
            finish: finish.id,
            accessory: accessory.id,
          });
        }
      }
    }
  }

  return {
    productId: model.id,
    productName: model.name,
    fits: fits.map((fit) => fit.id),
    componentChoiceCounts: Object.fromEntries(setupGroups(initial).map(([group, options]) => [group, options.length])),
    finishChoices: finishes.length,
    accessoryChoices: accessories.length,
    visualStates: states.size,
    themedStates: states.size * THEMES.length,
    responsiveAssets: states.size * THEMES.length * WIDTHS.length,
  };
}

const products = configuratorCatalog.models.map(enumerateModel);
const totals = products.reduce((result, product) => ({
  visualStates: result.visualStates + product.visualStates,
  themedStates: result.themedStates + product.themedStates,
  responsiveAssets: result.responsiveAssets + product.responsiveAssets,
}), { visualStates: 0, themedStates: 0, responsiveAssets: 0 });

console.log(JSON.stringify({
  schemaVersion: 1,
  contract: {
    themes: THEMES,
    widths: WIDTHS,
    note: 'Counts every currently selectable option exposed by the public configurator domain.',
  },
  products,
  totals,
}, null, 2));
