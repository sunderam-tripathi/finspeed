import React from 'react';
import {
  CONFIGURATOR_STEPS,
  configurationSummary,
  configuredCartFingerprint,
  configuredCartPreview,
  configuratorVisual,
  createDefaultBuild,
  formatConfiguratorPrice,
  resolveBuild,
  selectBuildOption,
} from '../../data/configurator.js';
import { usePersistentState } from '../../lib/usePersistentState.js';

const stageCopy = {
  'ride-type': 'Start with the roads and terrain that define most of your riding.',
  model: 'Choose the bicycle that feels right for the way you ride.',
  fit: 'Pick the wheel size and carrier setup that suits your ride.',
  'ride-setup': 'Review the brakes, fork and gears included with this bicycle.',
  finish: 'Choose the finish shown for this model.',
  accessories: 'Review the equipment included with your selected setup.',
  review: 'One final check before your build moves into your cart.',
};

const buildDetailCards = [
  {
    title: 'Stop with confidence',
    copy: 'Controlled braking for traffic, descents and quick changes in pace.',
    region: 'brakes',
  },
  {
    title: 'Stay settled',
    copy: 'Ride comfort that keeps the bike composed when the surface changes.',
    region: 'suspension',
  },
  {
    title: 'Move with ease',
    copy: 'The right gearing for climbs, starts and steady cruising.',
    region: 'drivetrain',
  },
  {
    title: 'Made to last',
    copy: 'A strong frame and practical parts chosen to feel dependable every day.',
    region: 'frame',
  },
];

function normalizedStatusLabel(status) {
  if (!status || status === 'catalog-audited') return 'Available';
  if (status === 'included') return 'Included';
  if (status === 'provisional') return 'Included';
  if (status.includes('provisional')) return 'Confirm before ordering';
  return status.replaceAll('-', ' ');
}

function optionMeta(option) {
  if (Number.isFinite(option.price)) return formatConfiguratorPrice(option.price);
  if (option.series) return option.series;
  if (option.wheel) return option.wheel;
  return '';
}

function buildConfigurationPayload(resolved, summary) {
  const setup = resolved.model.setup;
  const fingerprint = configuredCartFingerprint(resolved);
  return {
    version: resolved.build.version,
    fingerprint,
    preview: configuredCartPreview(resolved),
    commerce: {
      ready: resolved.commerceReady,
      status: resolved.commerceStatus,
    },
    build: resolved.build,
    model: { id: resolved.model.id, title: resolved.model.name },
    sku: { id: resolved.sku.id, title: resolved.sku.variantLabel, wheel: resolved.sku.wheel },
    fit: { ...resolved.build.fit },
    components: {
      brakes: { ...setup.brakes },
      fork: { ...setup.fork },
      drivetrain: { ...setup.drivetrain },
    },
    accessories: summary.includedAccessories.map((title) => ({ id: 'ibc-carrier', title })),
    base: { id: resolved.model.id, title: resolved.model.name, wheels: resolved.sku.variantLabel },
    brakes: { id: setup.brakes.id, title: setup.brakes.label },
    suspension: { id: setup.fork.id, title: setup.fork.label },
    gears: { id: setup.drivetrain.id, title: setup.drivetrain.label },
    finish: { id: resolved.build.finish, title: 'Catalog finish' },
  };
}

function ConfiguratorOption({ option, stageId, onSelect }) {
  const selected = Boolean(option.selected);
  const disabled = option.available === false;
  const meta = optionMeta(option);
  const status = option.status ? normalizedStatusLabel(option.status) : '';

  return (
    <label
      className={`configurator-option${selected ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}`}
    >
      <input
        type="radio"
        name={`configurator-${stageId}`}
        value={option.id}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(option.id)}
      />
      <span className="configurator-option__indicator" aria-hidden="true" />
      <span className="configurator-option__copy">
        <strong>{option.label}</strong>
        {option.copy && <small>{option.copy}</small>}
      </span>
      {meta && <span className="configurator-option__meta">{meta}</span>}
      {status && <span className="configurator-option__status">{status}</span>}
    </label>
  );
}

function IncludedSpecification({ option, label }) {
  const status = normalizedStatusLabel(option.status || (option.included ? 'included' : 'catalog-audited'));

  return (
    <div className="configurator-review__row" data-included-spec="true">
      <dt>{label}</dt>
      <dd>
        <span className="configurator-option__copy configurator-review__value">
          <strong>{option.label}</strong>
          {option.copy && <small>{option.copy}</small>}
        </span>
        <span className="configurator-option__status">{status}</span>
      </dd>
    </div>
  );
}

function StageOptions({ step, options, onSelect }) {
  if (step.id === 'ride-setup') {
    return (
      <dl className="configurator-review" aria-label="Included ride setup">
        {options.map((option) => (
          <IncludedSpecification key={option.group} option={option} label={option.group} />
        ))}
      </dl>
    );
  }


  if (options.every((option) => option.locked)) {
    return (
      <dl className="configurator-review" aria-label={step.eyebrow}>
        {options.map((option) => (
          <IncludedSpecification key={option.id} option={option} label={step.label} />
        ))}
      </dl>
    );
  }

  return (
    <fieldset className="configurator-fieldset">
      <legend>{step.eyebrow}</legend>
      <div className={`configurator-options${options.length === 1 ? ' configurator-options--single' : ''}`}>
        {options.map((option) => (
          <ConfiguratorOption key={option.id} option={option} stageId={step.id} onSelect={onSelect} />
        ))}
      </div>
    </fieldset>
  );
}

function BuildRide({ onNav, onAddConfigured, theme }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [storedBuild, setStoredBuild] = usePersistentState('finspeed.build', createDefaultBuild);
  const [changeNotice, setChangeNotice] = React.useState('');
  const [cartStatus, setCartStatus] = React.useState('');
  const [visualLoading, setVisualLoading] = React.useState(true);
  const [visualFailed, setVisualFailed] = React.useState(false);
  const stepRefs = React.useRef([]);
  const resolved = React.useMemo(() => resolveBuild(storedBuild), [storedBuild]);
  const summary = React.useMemo(() => configurationSummary(resolved), [resolved]);
  const visual = React.useMemo(() => configuratorVisual(resolved, theme), [resolved, theme]);
  const step = CONFIGURATOR_STEPS[activeStep];
  const options = resolved.options[step.id] || [];

  React.useEffect(() => {
    if (JSON.stringify(storedBuild) !== JSON.stringify(resolved.build)) {
      setStoredBuild(resolved.build);
    }
  }, [resolved.build, setStoredBuild, storedBuild]);

  React.useEffect(() => {
    setVisualLoading(true);
    setVisualFailed(false);
  }, [visual.id]);

  function activateStep(index, moveFocus = false) {
    const nextIndex = Math.max(0, Math.min(CONFIGURATOR_STEPS.length - 1, index));
    setActiveStep(nextIndex);
    setCartStatus('');
    if (moveFocus) window.requestAnimationFrame(() => stepRefs.current[nextIndex]?.focus());
  }

  function handleStepKeyDown(event, index) {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = Math.min(index + 1, CONFIGURATOR_STEPS.length - 1);
    else if (event.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = CONFIGURATOR_STEPS.length - 1;
    else return;
    event.preventDefault();
    activateStep(nextIndex, true);
  }

  function selectOption(optionId) {
    const before = resolved;
    const nextBuild = selectBuildOption(before.build, step.id, optionId);
    const next = resolveBuild(nextBuild, step.id);
    setVisualLoading(true);
    setStoredBuild(next.build);
    setCartStatus('');

    if (step.id === 'ride-type') {
      setChangeNotice(`${next.rideType.label} selected. ${next.model.name} is loaded as the starting bicycle.`);
    } else if (step.id === 'model') {
      setChangeNotice(`${next.model.name} selected. Its fit and included setup are now loaded.`);
    } else if (step.id === 'fit') {
      setChangeNotice(`${next.sku.variantLabel} selected at ${formatConfiguratorPrice(next.price)}.`);
    } else {
      setChangeNotice('This choice is included with the selected bicycle.');
    }
  }

  function continueBuild() {
    if (activeStep < CONFIGURATOR_STEPS.length - 1) activateStep(activeStep + 1, true);
  }

  function addConfiguredBuild() {
    if (!resolved.commerceReady) return;
    onAddConfigured?.({
      productId: resolved.model.id,
      unitPrice: resolved.price,
      fingerprint: configuredCartFingerprint(resolved),
      configuration: buildConfigurationPayload(resolved, summary),
    });
    setCartStatus(`${resolved.model.name} · ${resolved.sku.variantLabel} added to your cart.`);
  }

  function confirmWithFinspeed() {
    onNav('contact');
  }

  const issuePriority = { critical: 0, warning: 1, info: 2 };
  const prioritizedIssues = resolved.issues
    .filter(({ message }) => message)
    .sort((left, right) => (issuePriority[left.severity] ?? 3) - (issuePriority[right.severity] ?? 3));
  const isReview = step.id === 'review';
  const visibleIssues = isReview ? prioritizedIssues : prioritizedIssues.slice(0, 2);
  const hiddenIssueCount = prioritizedIssues.length - visibleIssues.length;
  const hasCriticalIssue = visibleIssues.some(({ severity }) => severity === 'critical');
  const reviewAction = resolved.identityConfirmationRequired ? confirmWithFinspeed : addConfiguredBuild;
  const reviewActionLabel = resolved.identityConfirmationRequired ? 'Confirm with Finspeed' : 'Add selected build';

  return (
    <div className="configurator-page">
      <section className="configurator-shell" aria-labelledby="configurator-title">
        <div className="configurator-controls">
          <header className="configurator-controls__header">
            <p className="configurator-eyebrow">Bespoke Ride Studio</p>
            <h1 className="configurator-title" id="configurator-title">{resolved.model.name}</h1>
            <p className="configurator-subtitle">Choose your size, setup and finish to suit the way you ride.</p>
            <p className="configurator-price">
              <span>Selected build</span>
              <strong>{formatConfiguratorPrice(resolved.price)}</strong>
              <span>· {resolved.sku.variantLabel}</span>
            </p>
          </header>

          <p className="configurator-step-count">Step {activeStep + 1} of {CONFIGURATOR_STEPS.length}</p>
          <nav className="configurator-progress" aria-label="Build progress">
            {CONFIGURATOR_STEPS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`configurator-progress__item${index === activeStep ? ' is-active' : ''}${index < activeStep ? ' is-complete' : ''}`}
                data-step={String(index + 1).padStart(2, '0')}
                aria-current={index === activeStep ? 'step' : undefined}
                ref={(element) => { stepRefs.current[index] = element; }}
                onClick={() => activateStep(index)}
                onKeyDown={(event) => handleStepKeyDown(event, index)}
              >
                <span>{item.shortLabel}</span>
              </button>
            ))}
          </nav>

          <div className="configurator-panel">
            <header className="configurator-panel__header">
              <p className="configurator-eyebrow">{step.eyebrow}</p>
              <h2>{step.label}</h2>
              <p>{stageCopy[step.id]}</p>
            </header>

            {isReview ? (
              <div className="configurator-review">
                <dl>
                  {summary.rows.map((row) => (
                    <div className="configurator-review__row" key={row.id}>
                      <dt>{row.label}</dt>
                      <dd>
                        {row.value}
                        {row.status === 'provisional' && <small>Confirm before ordering</small>}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="configurator-review__total">
                  <span>Selected build</span>
                  <strong>{summary.priceLabel}</strong>
                </div>
              </div>
            ) : (
              <StageOptions step={step} options={options} onSelect={selectOption} />
            )}

            {changeNotice && (
              <div className="configurator-auto-change" role="status">
                <span>{changeNotice}</span>
                <button type="button" onClick={() => setChangeNotice('')}>Dismiss</button>
              </div>
            )}

            {visibleIssues.length ? (
              <div className="configurator-notice" data-tone={hasCriticalIssue ? 'danger' : 'warning'} role={hasCriticalIssue ? 'alert' : 'status'}>
                <div>
                  <strong>{hasCriticalIssue ? 'Confirm before ordering' : 'Before you order'}</strong>
                  {visibleIssues.map((item) => <p key={item.code}>{item.message}</p>)}
                  {hiddenIssueCount > 0 && <p>{hiddenIssueCount} more detail{hiddenIssueCount === 1 ? '' : 's'} will be listed at Review.</p>}
                </div>
              </div>
            ) : (
              <div className="configurator-notice" data-tone="success" role="status">
                <p>This setup is available to order.</p>
              </div>
            )}
          </div>

          <div className="configurator-actions configurator-bottom-action">
            {activeStep > 0 && (
              <button type="button" className="configurator-action" onClick={() => activateStep(activeStep - 1, true)}>
                Back
              </button>
            )}
            <button
              type="button"
              className="configurator-action configurator-action--primary"
              disabled={isReview && !resolved.commerceReady && !resolved.identityConfirmationRequired}
              onClick={isReview ? reviewAction : continueBuild}
            >
              {isReview ? reviewActionLabel : 'Continue'}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          </div>
          <p className="configurator-saved-status" role="status">
            {cartStatus || (resolved.identityConfirmationRequired
              ? 'This model is available by enquiry. Contact us and we will confirm the details.'
              : 'Saved automatically on this device.')}
          </p>
        </div>

        <div className="configurator-stage" data-theme-tone={theme === 'dark' ? 'dark' : 'light'} aria-label="Selected bicycle preview">
          <div className="configurator-stage__frame">
            <picture className="configurator-stage__picture">
              <img
                key={visual.id}
                className={`configurator-stage__bike${visualLoading ? ' is-loading' : ''}`}
                src={visual.src}
                srcSet={visual.srcSet}
                sizes={visual.sizes}
                alt={visual.alt}
                decoding="async"
                onLoad={() => setVisualLoading(false)}
                onError={() => {
                  setVisualLoading(false);
                  setVisualFailed(true);
                }}
              />
            </picture>
            {visualLoading && <span className="configurator-stage__loading" role="status">Preparing selected bicycle</span>}
            {visualFailed && <span className="configurator-stage__loading" role="alert">The bicycle preview could not be loaded. Your selections are still saved.</span>}
          </div>
          <div className="configurator-stage__meta">
            <div>
              <span>Model</span>
              <strong>{resolved.model.name}</strong>
            </div>
            <div>
              <span>Fit</span>
              <strong>{resolved.sku.variantLabel}</strong>
            </div>
            <div>
              <span>Setup</span>
              <strong>{resolved.model.setup.drivetrain.label}</strong>
            </div>
          </div>
          {visual.note && <p className="configurator-stage__note">Contact us to confirm this exact setup before ordering.</p>}
        </div>
      </section>

      <section className="build-detail-strip" aria-labelledby="built-around-title">
        <div className="build-detail-strip__heading">
          <p id="built-around-title" className="editorial-kicker">Built around your ride</p>
          <span className="editorial-rule" aria-hidden="true" />
        </div>
        <div className="build-detail-strip__grid">
          {buildDetailCards.map(({ title, copy, region }) => (
            <article key={title} className="build-detail-card" data-region={region}>
              <img
                className="build-detail-card__product"
                src={visual.src}
                srcSet={visual.srcSet}
                sizes="(max-width: 700px) 100vw, 25vw"
                alt={`${resolved.model.name} bicycle detail illustrating ${title.toLowerCase()}`}
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
