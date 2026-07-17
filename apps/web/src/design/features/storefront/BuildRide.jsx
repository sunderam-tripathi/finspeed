import React from 'react';
import { productImage, productImageSrcSet } from '../../data/storefront.js';
import { usePersistentState } from '../../lib/usePersistentState.js';

const steps = [
  {
    id: 'base',
    label: 'Base',
    eyebrow: 'Choose your frame',
    options: [
      {
        id: 'mako',
        productId: 'mako-shark',
        title: 'Mako Shark',
        copy: '27.5-inch all-terrain hardtail with a high-tensile steel frame.',
        price: 10100,
        wheels: '27.5″ wheels',
      },
      {
        id: 'bull',
        productId: 'bull-shark',
        title: 'Bull Shark',
        copy: '29-inch big-wheel geometry for rollover confidence and trail stability.',
        price: 9500,
        wheels: '29″ wheels',
      },
    ],
  },
  {
    id: 'brakes',
    label: 'Brakes',
    eyebrow: 'Choose your brakes',
    options: [
      { id: 'power', title: 'Power Brakes', copy: 'Hydraulic disc brakes for strong, consistent stopping power in all conditions.', delta: 0 },
      { id: 'mechanical', title: 'Mechanical Disc', copy: 'Reliable mechanical disc brakes with precise control and easy maintenance.', delta: -900 },
    ],
  },
  {
    id: 'suspension',
    label: 'Suspension',
    eyebrow: 'Tune the front end',
    options: [
      { id: 'front', title: 'Front Suspension', copy: 'Absorbs rough surfaces while keeping the rear triangle efficient.', delta: 0 },
      { id: 'rigid', title: 'Rigid Fork', copy: 'Lower weight and direct road feedback for smoother routes.', delta: -700 },
    ],
  },
  {
    id: 'gears',
    label: 'Gears',
    eyebrow: 'Choose your range',
    options: [
      { id: '21', title: '21-Speed', copy: 'A broad 3 × 7 range for climbs, flats, and changing terrain.', delta: 0 },
      { id: 'single', title: 'Single Speed', copy: 'Low-maintenance simplicity for flatter, familiar routes.', delta: -1100 },
    ],
  },
  {
    id: 'finish',
    label: 'Finish',
    eyebrow: 'Make it yours',
    options: [
      { id: 'mint', title: 'Mako Mint', copy: 'The signature seafoam and graphite Finspeed finish.', delta: 0, color: '#8fd9c4' },
      { id: 'graphite', title: 'Deep Graphite', copy: 'A restrained dark finish with cyan identity details.', delta: 350, color: '#39424b' },
    ],
  },
];

const defaultBuild = {
  base: 'mako',
  brakes: 'power',
  suspension: 'front',
  gears: '21',
  finish: 'mint',
};

const buildDetailCards = [
  {
    title: 'Stop stronger',
    copy: 'Hydraulic power, controlled with confidence.',
    image: '/assets/campaign/build-detail-brakes-ai.webp',
  },
  {
    title: 'Smooth control',
    copy: 'Front suspension that absorbs the rough.',
    image: '/assets/campaign/build-detail-suspension-ai.webp',
  },
  {
    title: 'Shift precise',
    copy: 'Responsive gears built for every climb and sprint.',
    image: '/assets/campaign/build-detail-drivetrain-ai.webp',
  },
  {
    title: 'Built to last',
    copy: 'Lightweight frame. Serious durability. Trail ready.',
    image: '/assets/campaign/build-detail-frame-ai.webp',
  },
];

function optionFor(stepId, optionId) {
  const step = steps.find((item) => item.id === stepId);
  return step.options.find((option) => option.id === optionId) || step.options[0];
}

function normalizeBuild(value) {
  const candidate = value && typeof value === 'object' ? value : {};
  return steps.reduce((normalized, step) => {
    normalized[step.id] = optionFor(step.id, candidate[step.id]).id;
    return normalized;
  }, {});
}

function priceFor(build) {
  const base = optionFor('base', build.base);
  return steps.slice(1).reduce((price, step) => {
    const selected = step.options.find((option) => option.id === build[step.id]);
    return price + (selected?.delta || 0);
  }, base.price);
}

function BuildRide({ onNav, onAddConfigured }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [storedBuild, setStoredBuild] = usePersistentState('finspeed.build', defaultBuild);
  const [saved, setSaved] = React.useState(false);
  const [reviewing, setReviewing] = React.useState(false);
  const [cartStatus, setCartStatus] = React.useState('');
  const tabRefs = React.useRef([]);
  const build = normalizeBuild(storedBuild);
  const step = steps[activeStep];
  const selectedBase = optionFor('base', build.base);
  const selectedFinish = optionFor('finish', build.finish);
  const price = priceFor(build);

  function selectOption(optionId) {
    setStoredBuild((current) => ({ ...normalizeBuild(current), [step.id]: optionId }));
    setSaved(false);
    setReviewing(false);
    setCartStatus('');
  }

  function activateStep(index, moveFocus = false) {
    setActiveStep(index);
    setReviewing(false);
    if (moveFocus) tabRefs.current[index]?.focus();
  }

  function handleStepKeyDown(event, index) {
    const last = steps.length - 1;
    let nextIndex;

    if (event.key === 'ArrowRight') nextIndex = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') nextIndex = index === 0 ? last : index - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = last;
    else return;

    event.preventDefault();
    activateStep(nextIndex, true);
  }

  function continueBuild() {
    if (activeStep < steps.length - 1) {
      setActiveStep((current) => current + 1);
      return;
    }
    setSaved(false);
    setReviewing(true);
  }

  function addConfiguredBuild() {
    onAddConfigured?.({
      productId: selectedBase.productId,
      unitPrice: price,
      configuration: {
        base: { id: build.base, title: selectedBase.title, wheels: selectedBase.wheels },
        brakes: { id: build.brakes, title: optionFor('brakes', build.brakes).title },
        suspension: { id: build.suspension, title: optionFor('suspension', build.suspension).title },
        gears: { id: build.gears, title: optionFor('gears', build.gears).title },
        finish: { id: build.finish, title: selectedFinish.title },
      },
    });
    setSaved(true);
    setCartStatus('Configured build added to your cart.');
  }

  return (
    <div className="build-ride-page">
      <section className="build-studio" aria-labelledby="build-title">
        <div className="build-studio__controls">
          <p className="editorial-kicker">Bespoke Ride Studio</p>
          <h1 id="build-title">{selectedBase.title}</h1>
          <span className="editorial-rule" aria-hidden="true" />
          <p className="build-studio__price">
            From <strong>₹{price.toLocaleString('en-IN')}</strong>
            {' · '}<span>{selectedBase.wheels}</span>
          </p>

          <div className="build-studio__steps" role="tablist" aria-label="Build steps">
            {steps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`build-step-tab-${item.id}`}
                aria-controls="build-step-panel"
                aria-selected={activeStep === index}
                tabIndex={activeStep === index ? 0 : -1}
                className={activeStep === index ? 'is-active' : ''}
                ref={(element) => { tabRefs.current[index] = element; }}
                onClick={() => activateStep(index)}
                onKeyDown={(event) => handleStepKeyDown(event, index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div
            className="build-studio__options"
            role="tabpanel"
            id="build-step-panel"
            aria-labelledby={`build-step-tab-${step.id}`}
          >
            {reviewing ? (
              <>
                <p className="editorial-kicker">Build review</p>
                <h2>Your {selectedBase.title} build</h2>
                {[
                  ['Frame', `${selectedBase.title} · ${selectedBase.wheels}`],
                  ['Components', `${optionFor('brakes', build.brakes).title} · ${optionFor('suspension', build.suspension).title} · ${optionFor('gears', build.gears).title}`],
                  ['Finish', selectedFinish.title],
                ].map(([label, value]) => (
                  <div key={label} className="build-option is-selected" style={{ cursor: 'default' }}>
                    <span className="build-option__radio" aria-hidden="true" />
                    <span>
                      <strong>{label}</strong>
                      <small>{value}</small>
                    </span>
                  </div>
                ))}
                <p className="build-studio__compatibility">
                  Review total: ₹{price.toLocaleString('en-IN')}. Your choices remain saved on this device.
                </p>
              </>
            ) : (
              <>
                <p className="editorial-kicker">{step.eyebrow}</p>
                {step.options.map((option) => {
                  const selected = build[step.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`build-option${selected ? ' is-selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => selectOption(option.id)}
                    >
                      <span className="build-option__radio" aria-hidden="true" />
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.copy}</small>
                      </span>
                      {option.color && <span className="build-option__swatch" style={{ background: option.color }} aria-hidden="true" />}
                    </button>
                  );
                })}
                <p className="build-studio__compatibility">
                  {step.id === 'finish'
                    ? `Selected finish: ${selectedFinish.title}. Official product photography is shown unchanged.`
                    : 'Available combinations are checked for your selected frame.'}
                </p>
              </>
            )}
          </div>

          <div className="build-studio__actions">
            <button
              type="button"
              className="editorial-cta editorial-cta--primary"
              onClick={reviewing ? addConfiguredBuild : continueBuild}
            >
              {reviewing ? 'Add configured bike' : activeStep === steps.length - 1 ? 'Finish your build' : 'Continue your build'}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="editorial-cta editorial-cta--secondary"
              onClick={reviewing ? () => setReviewing(false) : () => setSaved(true)}
            >
              {reviewing ? 'Edit your build' : 'Save configuration'}
            </button>
          </div>
          {saved && <p className="build-studio__saved" role="status">{cartStatus || 'Configuration saved on this device.'}</p>}
        </div>

        <div className="build-studio__visual">
          <div className="build-studio__image-stage">
            <img
              key={selectedBase.productId}
              src={productImage(selectedBase.productId, 1600)}
              srcSet={productImageSrcSet(selectedBase.productId)}
              sizes="(max-width: 900px) 100vw, 62vw"
              alt={`Finspeed ${selectedBase.title} bicycle in side profile`}
            />
          </div>
          <div className="build-studio__spec-line">
            <span>{selectedBase.wheels}</span>
            <span>{build.brakes === 'mechanical' ? 'Mechanical disc' : 'Power brakes'}</span>
            <span>{build.suspension === 'front' ? 'Front suspension' : 'Rigid fork'}</span>
            <span>{build.gears === '21' ? '21-speed' : 'Single speed'}</span>
            <span>Finish: {selectedFinish.title}</span>
          </div>
        </div>
      </section>

      <section className="build-detail-strip" aria-labelledby="built-around-title">
        <div className="build-detail-strip__heading">
          <p id="built-around-title" className="editorial-kicker">Built around your ride</p>
          <span className="editorial-rule" aria-hidden="true" />
        </div>
        <div className="build-detail-strip__grid">
          {buildDetailCards.map(({ title, copy, image }) => (
            <article key={title} className="build-detail-card">
              <img
                src={image}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="build-next-step">
        <p className="editorial-kicker">Prefer to compare first?</p>
        <h2>See every frame before you commit.</h2>
        <button type="button" className="editorial-text-link" onClick={() => onNav('shop')}>
          Explore the range <i data-lucide="arrow-right" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

export default BuildRide;
