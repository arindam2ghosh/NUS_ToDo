# Project Overview

This project is a React + Vite implementation of the classic "todos" demo from MDN. It showcases a small but complete task management UI that demonstrates React component composition, state management, and controlled form inputs. The app is bootstrapped with Vite for a fast local development experience.

# Build and Test Commands

- Development server: `yarn dev`
- Production build: `yarn build`
- Preview built assets: `yarn preview`
- Linting: `yarn lint`
- Test suite: Not configured. Add a test runner such as Vitest or Jest before introducing automated tests.

# Code Style Guidelines

- Follow the ESLint rules defined in the project; run `yarn lint` before committing.
- Use modern ES modules and React functional components with hooks.
- Prefer descriptive component and prop names; keep components small and focused.
- Keep styling changes inside `src/index.css` or component-level CSS modules if you add them.

# Testing Instructions

1. Ensure dependencies are installed with `yarn install`.
2. Build the project via `yarn build`.
3. Run `yarn preview` to serve the production bundle locally and verify functionality.
4. Until a test framework is added, rely on manual verification through the preview server.

# Security Considerations

- Keep dependencies updated via `yarn upgrade` to receive upstream security patches.
- Do not commit secrets or API keys; use environment variables if sensitive data is introduced.
- When adding new dependencies, review them for known vulnerabilities (e.g., via `npm audit` or `yarn npm audit`).
- Sanitize any future user-generated content before rendering to avoid injection issues.
