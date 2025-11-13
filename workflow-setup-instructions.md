Replicating the Anansol Autonomous Workflow in a New Project
Overview: The Anansol repository provides a spec-driven workflow for autonomous agents, with rigorous charters, guards, and tools. To replicate this in a fresh project, you will set up a similar file/folder scaffold and follow a step-by-step initialization. Each step below is mutually exclusive and collectively exhaustive (MECE), covering all key components of the main branch.
Establish a Comprehensive Knowledge Base (specs/references/) – Start by creating a reference library that captures all background knowledge, requirements, and design info for your project
GitHub
. Organize this under specs/references/ in as a handoff from the requirements and achitecture (handoff folder - handoff-guide.md). For each category and sub-domain:
Create descriptive markdown documents containing the canonical information (system overviews, protocols, style guides, etc.). For example, specs/references/philosophy/project-philosophy.md might outline high-level principles, while specs/references/architecture/domainA/overview.md details the architecture of Domain A.
Ensure each category has an index (README.md) listing its reference docs and status
GitHub
. This makes it easy to find all references.
Tip: If new categories are needed later, include a “category stub checklist” (similar to Anansol’s) to standardize adding them
GitHub
. Every key reference should be cross-linked to specs and proofs for traceability (when a reference informs a slice’s work, the proof should cite that reference
GitHub
).
Define Domain Specifications and Slices (specs/contracts/<domain>/) – Based on the reference knowledge, partition the project into distinct domains (modules or concern areas) such that all information is covered without overlap. For each domain, create a JSON spec file (e.g. specs/contracts/<domain>/json/spec.json) capturing the formal contract for that domain. Each domain spec should include:
Philosophy & References: Links to relevant philosophy or design docs that anchor this domain (e.g. an entry referencing the philosophy and technical spec docs)
GitHub
.
Objectives: A short list of what this domain aims to achieve or deliver
GitHub
.
Scope (In/Out): Define what falls in scope vs. out of scope for the domain
GitHub
. This ensures clarity on the domain’s boundaries.
Acceptance Criteria: Explicit criteria to consider the domain’s implementation complete
GitHub
. These should correspond to measurable outcomes or capabilities.
Slices: Break the domain’s work into sequential, bite-sized slices (tasks or feature increments). Each slice gets a unique ID (e.g. DOMAIN-001) and includes a title, a “done definition” checklist, and an allow-list of files it can touch. For example, a slice entry in JSON might look like:
{
  "id": "WEB-001",
  "title": "Implement user login page",
  "done_definition": [
    "Login UI implemented with form and validations",
    "Authentication API integrated and working (happy path and errors)",
    "All acceptance criteria met and documented"
  ],
  "allow": [
    "apps/web/**",
    "specs/contracts/web/**",
    "specs/notes/plans/web/WEB-001.md",
    "specs/proofs/web/WEB-001/**",
    "AGENTS.md",
    "specs/project-progress/slice-ledger.json"
  ]
}
This structure mirrors Anansol’s approach (each slice has clear success criteria and limited file scope)
GitHub
GitHub
. The allow-list restricts changes to relevant areas – if a file isn’t in the list, it shouldn’t be edited under that slice, enforcing least privilege.
Dependencies: Optionally list other domain specs that this domain depends on (e.g. a “web” domain might depend on “auth” or “data” domains being in place)
GitHub
.
After drafting all domain specs, verify that collectively they cover 100% of the knowledge base (every requirement from references is allocated to a domain) and no two domains overlap in scope (MECE). This ensures every reference concept maps to a slice in some spec. Cross-check using a “traceability matrix” if available to confirm every reference is linked to a slice plan or objective.
Set Up Slice Tracking and Progress Coordination – Create a central project ledger to track all slices across domains and their status. In Anansol, this lives in specs/project-progress/:
Slice Ledger (slice-ledger.json): A JSON file listing every slice ID, grouped in chronological “steps” (phases) of execution, along with a status for each (todo, in_progress, or done)
GitHub
. Initially, populate this with all planned slices (from the domain specs above) marked as todo and grouped logically (e.g. Step 1 contains foundational slices, Step 2 next phase, etc.). As work proceeds, you will update statuses here. Never remove or reorder old slices – treat the ledger as an append-only history of what was done when
GitHub
.
Active Slice Pointer (specs/working-memory/active-slice.json): This file holds the currently active slice ID, its domain, title, and the allowed file patterns for that slice. For example:
{ "id": "WEB-001", "domain": "web", "title": "Implement user login page", "allow": [ ... ] }
Only one slice should be active at a time. When starting a new task, update active-slice.json to that slice’s ID and copy its allow-list from the domain spec
GitHub
. This enforces the scope: guard scripts will check that any git changes stay within this allow-list and that the slice is marked in_progress in the ledger
GitHub
. If no feature work is in progress (idle state), use a special ID like "IDLE" with a minimal allow-list (just coordination files like the ledger itself).
Progress Summary (progress-summary.json): Set up a script to generate this summary report whenever the ledger updates. It calculates overall progress: slices done vs total, and flags any mismatches between spec and ledger (e.g. a slice in spec but not logged in ledger)
GitHub
. It’s essentially a snapshot of project status by domain and step, helping ensure nothing “falls through the cracks.”
Slice Index (specs/notes/indexes/slice-index.md): Optionally, maintain a human-readable index of slices (often auto-generated). This is a Markdown list or table of all slice IDs with titles grouped by domain or step. It provides quick navigation for stakeholders. Update it when slices are added or completed (scripts can automate this via npm run spec:slice-index).
Usage: Always keep the active slice, ledger, and indexes in sync. For example, when you activate a slice, mark it in_progress in the ledger and ensure it exists in the domain spec; when a slice is finished, mark it done in ledger and generate a new progress summary. Anansol’s guidelines emphasize updating the ledger, slice index, and progress summary together in the same commit for consistency
GitHub
. After each change, run the provided scripts to refresh indexes and summaries, and inspect the alignment section (differences between spec vs. ledger) – over time, alignment errors should trend to zero if you keep everything updated
GitHub
.
Create the Global Charter and Domain Capsules (AGENTS/ directory) – The AGENTS folder contains the guiding instructions that the AI agent (and you as steward) will follow. This is essentially the “rulebook” for how to do the work. Set up the following:
Root Execution Contract (AGENTS.md in repo root): This is the entry-point charter that defines the agent’s role, authority, and high-level workflow. In Anansol, AGENTS.md begins with a YAML front-matter specifying it as a global_charter (applying to all domains) and references to important runbooks and spec files
GitHub
GitHub
. In the content, include sections for:
Persona & Operating Context: State that the AI agent is effectively the sole engineer and steward for the project, with full access and responsibility
GitHub
. Emphasize that it must act as all stakeholders (engineering, QA, security, etc.) and that no external escalation occurs unless the agent has exhausted all remediation (i.e. it should solve problems autonomously and analytically)
GitHub
.
Non-negotiable practices: Note things like “Always create a multi-step plan before coding” and “Never stash work off-record – commit or branch instead”
GitHub
. These ensure transparency and planning discipline.
Workflow & Gate Controls: Outline the step-by-step workflow the agent must follow for each slice. In Anansol, this is a numbered list of 5 major stages
GitHub
: (1) Align the slice state (make sure active-slice.json is set and if it was IDLE, formally activate a new slice using the tooling)
GitHub
; (2) Load all relevant knowledge (the agent should load the global charter modules and the domain-specific capsule for the domain it’s working in, plus any slice-specific supplements)
GitHub
; (3) Execute guarded development (perform the coding or writing tasks while obeying all guardrails – e.g. run all commands in a controlled environment, only edit within allowed paths, etc.)
GitHub
; (4) Capture proof of completion (gather logs, screenshots, test results, etc., and document a proof report)
GitHub
; (5) Close out and “park” the slice (update telemetry, commit changes following the git runbook, then mark the slice done and set the active slice to idle)
GitHub
. These steps should be clearly listed so the agent knows the expected lifecycle for each task.
Safety & Escalation: Provide rules for handling critical scenarios. For example: “Treat every edit as if it’s production-impacting – double-check dangerous operations” and “If something goes wrong (security issue, major incident), attempt mitigations using first principles and document them; only escalate to a human if absolutely necessary, and even then include a full log of what was tried”
GitHub
. This ensures the agent knows how to handle errors or security incidents (perhaps referencing a security domain capsule for specifics).
Guardrails (Control Matrix): It’s useful to include a summary table of the main guard pillars or rules that the agent must always follow
GitHub
. In Anansol’s charter, for instance, there are pillars like “Quality over speed” (never skip tests or checks), “Slice accountability” (maintain plans and progress logs for each slice), “Guard activation” (always activate a slice ID before editing), “Dual-environment testing” (validate changes in both the local parity environment and the live/staging environment), “Credential hygiene” (never record secrets in code or history), etc.
GitHub
GitHub
. Each pillar references where more detail can be found (like a runbook or capsule). Recreate a similar matrix in your charter so the agent has at-a-glance rules.
This root AGENTS.md should be loaded first whenever the agent starts work, so it serves as the authoritative contract
GitHub
. Make sure to cite any critical linked materials (runbooks or reference docs) in the front-matter for easy access
GitHub
.
Global Charter Modules (AGENTS/charter/*.md): These are support documents that augment the global charter with detailed tables and lists (without repeating the charter). In Anansol, the global charter is split into modules like:
Navigation Matrix (navigation-matrix.md): Quick pointers to important philosophy docs, guard configurations, runbook catalogs, etc.
GitHub
. Think of this as an index of helpful links and guidelines so the agent can “orient” itself.
Proof & Telemetry Matrix (proof-telemetry.md): Defines what proof artifacts are required (screenshots, logs, RESULT markers in docs) and how telemetry (progress reports) are updated for each slice
GitHub
. Essentially, it standardizes how to produce proofs and update project stats.
Automation Matrix (automation-matrix.md): Lists all command-line guard and dev tools available, with their usage
GitHub
GitHub
. For example, it would include entries for checking guard status, setting slices to idle, generating plan stubs, running documentation lint, refreshing the Docker environment, launching managed processes, etc. (we cover these tools in the next step). Having this matrix means the agent always knows how to invoke the provided automation for any given task.
Each charter module is referenced in the main charter and loaded right after AGENTS.md
GitHub
. They use front-matter type: global_charter with precedence: augment_global so they extend the root charter without overriding it
GitHub
. In your project, you can use these modules as templates, adjusting for your specific tools or conventions.
Domain Capsules (AGENTS/domains/<domain>.md): For each domain that you defined in specs (web, API, devops, security, etc.), create a capsule file with domain-specific guidance. This is like a “quickstart” or SOP for working on that domain’s code. In the front-matter, mark it as type: domain_capsule and specify which domain it applies to (e.g. domain: web)
GitHub
. Inside, include sections such as:
Coordination Discipline: Special rules when working on that domain. For example, the “repo” domain capsule in Anansol reserves a slice REPO-001 for repository-wide maintenance tasks and reminds the agent to update ledger, index, and summary together
GitHub
. Likewise, a “web” domain capsule might remind the agent to run frontend unit tests and ensure UI/UX consistency, or a “security” capsule might list steps for reviewing security configurations when that domain is active.
Commands & Tooling: A table of common tasks and the commands to run for this domain
GitHub
. For instance, the web capsule might list how to start the React dev server, run linter, build for production, etc. The devops capsule might show how to deploy infrastructure as code or run Terraform plans. These commands ensure the agent knows how to test and validate changes in that domain’s context. (Many of these will wrap the global tools – e.g. “Guard status” might just call the global check-active-slice script, but it’s listed for convenience
GitHub
.)
Proof Expectations: Any domain-specific proof requirements
GitHub
. For example, the quality/testing domain might require certain test coverage evidence in proofs, or the security domain might require attaching a vulnerability scan report. If none are special, this can defer to the global proof standards.
Stewardship & Maintenance: Guidelines for long-term care of this domain
GitHub
. E.g., “review dependency updates monthly” for a frontend domain, or “rotate keys quarterly” for security. This helps future maintainers (or the agent itself in long-running projects) to keep things from growing stale.
In front-matter, set an owner (e.g. "@web-steward") and last_updated date
GitHub
 – these are mostly for bookkeeping, but they signal who is responsible for domain integrity. Also link any domain-specific runbooks or reference docs in the front-matter (for example, the repo capsule links to a Git workflow runbook and its spec file)
GitHub
.
Slice Supplements (AGENTS/slices/ – optional): In some cases, a particular slice or pattern of work might need extra instructions beyond the domain capsule. For instance, if there’s a complex migration process or an override procedure, you can write a slice supplement guide (with type: slice_supplement). Use the front-matter applies_to to specify which slice ID(s) or domain it relates to
GitHub
. The agent loader will automatically include any supplements that match the active slice
GitHub
. Anansol used this to document things like manual gate override processes in a supplement. In your scaffold, you might not create any initially, but be aware of this extension point.
Implement Guard Scripts and Automation Tools (tools/ directory) – A core part of this workflow is the suite of tools that enforce the rules and help the agent perform tasks. Reproduce the essential scripts from Anansol (you can adapt their logic to your project specifics):
Active Slice Management: Provide a script to check guard status (e.g. tools/spec/check-active-slice.mjs) and one to set the active slice (e.g. set-active-slice.mjs). The check script should read active-slice.json and give a quick status (which slice is active, or if none) and maybe validate that the slice is known. The set script should allow switching the active slice (including an --idle flag to park). In Anansol, check-active-slice.mjs is used before any edit to ensure a slice is active (it will warn or fail if the repo is in an IDLE state)
GitHub
. The set-active-slice.mjs updates the JSON and also adjusts the allow-list for the new slice automatically.
Pre-commit/Pre-push Guards: Integrate Git hooks that call enforcement scripts before commits and pushes. For example, a pre-push hook should run the active-slice check and verify slice scope (Anansol’s verify-active-slice.mjs is invoked here)
GitHub
GitHub
. The verify script ensures that any files you’ve staged are allowed by the current slice’s allow-list and that the slice is properly registered as in_progress in the ledger
GitHub
. If something is out of bounds, it will reject the commit/push with an error, preventing rule violations. The hook can also run additional quality gates (run linters, tests, etc. – more on this below). Setting up these hooks is crucial so the workflow is enforced automatically.
Plan Generation and Linting: Include a tool to scaffold new plan files from a template. For instance, generate-plan.mjs (exposed via npm run spec:plan-generate) should create a Markdown file in specs/notes/plans/<domain>/<SLICE-ID>.md pre-filled with a header and placeholder sections (like “Steps to implement”, “Testing notes”, etc.). The agent will fill this out when planning a slice. Also provide a plan linter (plan-lint.mjs) to check that all plan files follow the expected format and perhaps that every step has a corresponding proof result. This can be run on each commit to maintain plan quality (Anansol runs a strict lint on changed plans, and a warning-level check on all plans)
GitHub
.
Spec and Docs Maintenance: Bring over scripts to maintain the specs and docs coherence. For example, slice-index.mjs to regenerate the slice index file from the ledger, update-progress.mjs to refresh progress-summary.json totals, and agents-lint.mjs to validate that all your AGENTS files (charters and capsules) have correct metadata and no missing domains
GitHub
GitHub
. You should also have a doc link checker (Anansol’s link-health.mjs) to ensure no broken cross-references, and a README linter (readme-lint.mjs) to enforce documentation coverage. These help keep the knowledge base accurate as the project evolves.
Development Environment Tools: Set up any tooling needed to mirror production environment for testing (the “parity stack”). In Anansol, tools/dev/parity-stack.mjs can ensure the Docker-based local stack is running, refresh it, or stop it
GitHub
. Similarly, include scripts to launch long-running dev servers in the background without blocking the agent’s shell (run-managed.mjs)
GitHub
. For example, you might wrap npm run dev or backend processes so their output goes to logs under tmp/process-logs/ and can be referenced in proofs
GitHub
. If your project requires privileged OS commands (like modifying system settings), implement a sudo queue (sudo-request.mjs) where the agent can log a request for a privileged command and you (the human steward) acknowledge it. This creates an auditable trail for any admin actions
GitHub
.
Quality Gates and CI: In addition to local hooks, define what the CI pipeline will enforce. Typically, mirror the pre-push checks: re-run the spec guard (verify-active-slice), the spec/docs linters, and all tests. For example, ensure frontend lint, type-check, and build pass (Anansol’s pre-push runs npm run lint, typecheck, build for the web app)
GitHub
, run Go vet and build for backend
GitHub
, and validate schemas (e.g. OpenAPI or JSON schemas via make validate-contracts)
GitHub
. Incorporate these into a Makefile or package scripts so they can be run locally too. The idea is that by the time a commit is pushed, it has already passed all these gates in the dev environment
GitHub
GitHub
.
Make Commands Discoverable: Document all these tools in the Automation Matrix charter
GitHub
 and in any relevant capsule. For instance, list the exact CLI commands for “Guard status”, “Plan generation”, “Telemetry update” etc., as in the example automation table
GitHub
. This way, the agent (and other contributors) can easily find how to invoke each tool. Finally, test the tools by simulating a slice workflow to ensure they behave as expected (e.g. try activating a slice, making an out-of-scope edit, and confirm the pre-commit hook blocks it).
Execute the Spec-Driven Workflow (Step-by-Step Guide for the Agent) – With all scaffolding in place, you (as the steward) will initiate the workflow on a “black slate” (fresh project) and the agent will autonomously carry out development slice by slice. Below is how a typical slice cycle should run, following the established Anansol pattern:
Kick off a New Slice: When you’re ready to implement a feature or task, choose the next todo slice from slice-ledger.json (or create a new slice entry if expanding scope). Activate it by running the guard command (e.g. node tools/spec/set-active-slice.mjs --slice <ID>). This updates active-slice.json and primes the allow-list
GitHub
. Verify the status by running node tools/spec/check-active-slice.mjs – it should report the slice ID, domain, and allow-list. If the repository was idle, the agent is now “unparked” and ready to work on this specific scope. Important: ensure the slice ID exists in its domain spec and is marked in_progress in the ledger before proceeding (the guard scripts will enforce this)
GitHub
. Also confirm there’s a plan stub for this slice (generate one if not) so the agent has a place to write its plan
GitHub
.
Load All Relevant Instructions: The agent should now gather context. Use the loader tool (e.g. node tools/spec/agents-load.mjs --slice <ID> --format text) to pull together the full set of instructions
GitHub
GitHub
. This will concatenate the global charter, the applicable domain capsule(s) for the slice’s domain, and any slice-specific supplement into one text. As steward, you feed this to the AI agent so it internalizes the rules, constraints, and goals before writing any code. In addition, the agent should review any reference docs linked in the spec for this slice (e.g. architecture diagrams or API specs in specs/references/) and the acceptance criteria from the domain spec
GitHub
. At this stage, the agent has the blueprint of what to do and how to do it according to your project’s standards.
Plan the Implementation: The agent creates or refines the slice’s plan in specs/notes/plans/<domain>/<ID>.md. This Markdown plan should break down the steps to deliver the slice’s done-definition. For example, it might list: design considerations, code changes by component, tests to write, and any deployment or docs updates. The agent uses the plan template (from the earlier generation step) to fill in details. As steward, ensure the plan covers all acceptance criteria and addresses any risks (the plan is effectively the agent thinking on paper). Before coding, the agent can run npm run spec:plan-lint to verify the plan’s format and completeness (no missing sections, all steps numbered, etc.).
Execute Guarded Development: Now the agent writes code, configs, or docs to implement the plan – strictly within the allowed files. It should follow any guidelines from the domain capsule (for example, coding style or specific commands to run). During this execution:
The agent frequently runs tests and validations. Use the parity environment tools to start services: e.g. run node tools/dev/parity-stack.mjs ensure to spin up local containers (database emulators, etc.) so that the app runs in an environment mimicking production
GitHub
. The agent then runs the app or tests inside this environment (e.g. make dev-web which internally uses run-managed.mjs to keep logs).
Continuously enforce guardrails: The agent should not touch files outside its slice allow-list (the pre-commit hook will catch violations if it does). It should also keep an eye on the commit hygiene – e.g. follow the Git workflow runbook for proper commit messages and branch strategy (if any). By design, any attempt to make an out-of-scope change (like editing another domain’s file) will be blocked by verify-active-slice.mjs in git hooks
GitHub
, so the agent will learn to update active-slice.json (with steward approval) if scope expansion is truly needed or to defer that change.
If any privileged operation is needed (say the agent must run a shell command requiring sudo), it uses the sudo-request.mjs tool to log a request rather than executing immediately
GitHub
. As steward, you’d review and run those commands externally, then acknowledge them. In many cases for a general software project, this step might not occur frequently – it’s more relevant if modifying system settings or infrastructure.
Continuous Proof Gathering: As the agent works, it should collect evidence of progress. Encourage it to capture logs of tests passing, screenshots of UIs, etc. By the time the code solution is ready, the agent should assemble a proof bundle under specs/proofs/<domain>/<ID>/. Typically, this includes a README.md describing the verification steps and results, and subfolders for any artifacts (images, log text files, exports). In Anansol’s process, every slice’s proof must demonstrate the feature working in both the local parity environment and in a real (or staging) environment
GitHub
GitHub
. For your project, that means if possible, deploy or run the new feature in an isolated prod-like setting and gather evidence (for example, a screenshot of the feature in a browser, plus a snippet of server log). The proof README should explicitly note how the evidence was checked and include “RESULT: Proof acceptance” where the agent (acting as reviewer) confirms the criteria are met
GitHub
.
Final Checks and Commit: Before closing the slice, run all quality checks one more time. The agent should use npm run lint:readme (documentation lint) to ensure all README and reference links are up to date. Run test suites, linting, type-checks, etc., to confirm nothing is broken (these may have been running throughout if using a watcher). Then update the project telemetry: execute npm run spec:progress to rebuild the progress-summary.json and ensure the ledger status counts are updated
GitHub
. Also run npm run spec:slice-index to refresh the index if needed. All these updates (ledger status change from in_progress to done, progress summary JSON, and any index notes) should be staged for commit. Now follow the guarded commit routine (Anansol provides a runbook specs/runbooks/repo/git-workflow.md which the agent should follow for things like conventional commit messages, including the proof ID in the message, etc.). The pre-push hook will run one final verification: it will ensure the active slice is now marked done and only proof or coordination files changed after marking done (no sneaky code changes after completion)
GitHub
. It will also run the full test suite and lint one more time as a safety net
GitHub
GitHub
. If anything fails, the agent must fix it before the commit is accepted. Once everything passes, commit the changes.
Park the Workflow: After pushing the completed slice, “park” the agent by clearing the active slice. Run node tools/spec/set-active-slice.mjs --idle to set the mode back to IDLE
GitHub
. This will widen the allow-list to only coordination files (so no new code edits happen without an active slice) and essentially lock the repo. Archive any guard logs from the session (store the check-active-slice outputs or commit hook logs in the proof folder for audit trail, as Anansol suggests)
GitHub
. At this point, the slice is fully done – its spec entry is delivered, its proof is captured, and the agent is ready to pick up the next slice. The cycle then repeats for the next todo item.
Maintain and Iterate on the Process – Finally, keep this workflow up-to-date as your project grows:
Templates and Placeholders: As part of your scaffold, you might prepare some file templates (with placeholders <ProjectName>, <DomainName>, etc.) for recurring files. For example, a template for new domain capsule MDs, or a plan MD template (used by the plan generator). Store these in a specs/templates/ folder or integrate into your generation scripts. This ensures consistency every time you add a new component.
Evolving Specs: When new knowledge emerges or requirements change, update the reference docs in specs/references and adjust domain specs or add new slices accordingly. Always strive to keep the specs and ledger aligned – if you introduce a new slice in a spec, add it to the ledger (status todo), and vice versa, if you add work in ledger, make sure it’s described in a spec
GitHub
. Use the spec:matrix or similar traceability checks to identify any gaps (Anansol’s tooling can flag “spec-only” vs “ledger-only” slices in the progress summary)
GitHub
.
Regular Audits: Periodically run the agents metadata lint (npm run spec:agents) to catch any broken links in charters or missing capsules
GitHub
. Also review the content of charters and capsules – these should be updated when processes change or new tools are introduced
GitHub
. For example, if you add a new important command or guard, update the Automation Matrix and relevant capsule with the new information. Maintain the last_updated fields in front-matter when you make changes, so anyone reading knows how recent the guidance is
GitHub
.
Onboarding New Domains or Categories: If your project scope widens (say you add an analytics domain or a new reference category), follow the established patterns. Create the new domain’s spec JSON and capsule, add the domain to any global lists (like if there’s a “domains” index), and list it in any dependency arrays in other specs if needed. For reference categories, use the category stub checklist to quickly scaffold the directory and README
GitHub
. Run npm run docs:check (as in Anansol) which can bundle several maintenance tasks to ensure nothing was overlooked (link checks, index verification, etc.)
GitHub
.
Steward’s Role: In this autonomous setup, the human’s role (steward) is primarily to monitor and guide high-level decisions. Ensure the agent sticks to the process (the guardrails will help enforce it). When the agent requests something unusual (e.g. a sudo command or an scope expansion that wasn’t anticipated), evaluate and update the specs or capsules if necessary to address that scenario in the future. Essentially, treat the process itself as continuously improvable – each “guard breach” or confusion is a chance to update the rules (there is even an active-slice breach runbook referenced for handling when the agent accidentally works out-of-scope
GitHub
). By keeping the workflow documentation exhaustive and current, you enable the agent to perform increasingly complex work reliably on its own.
Following the above scaffold and steps will set up a robust, spec-driven workflow similar to Anansol’s. You will have a complete blueprint of file/folder structures (charters, specs, plans, proofs, tools) and a clear procedural guide so an AI agent can autonomously execute project tasks from planning through proof. This ensures every piece of project knowledge is encoded in the repository and every change is gated and documented, yielding a reliable and auditable development process. Enjoy your new project’s over-engineered yet confidence-inspiring setup! 🚀