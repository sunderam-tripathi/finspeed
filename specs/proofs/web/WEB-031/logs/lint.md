# ESLint

Command: `npm run lint -w web`

Result: PASS (exit 0)

- Errors: 0
- Warnings: 42
- The warning set is pre-existing and includes the established raw-image and unused-expression warnings; WEB-031 introduces no lint error.
- After the dark-theme semantic-token fix, `npm exec --workspace web -- eslint src/design/features/storefront/ProductDetail.jsx` also passed with 0 errors and the same 2 established raw-image warnings for that file.
