# AGENTS.md

## Project: Arcana Vault

Arcana Vault is a secure cloud-storage Progressive Web App (PWA) for storing and managing user videos, images, and documents.

### Tech Stack
- **Frontend:** Ionic + Angular
- **Backend services:** Supabase + custom backend API
- **App type:** PWA

This file defines the standards and expectations that coding agents must follow when working on this project.

## Core Principles

- Prioritize **security, maintainability, and clarity** over cleverness.
- Follow **Angular best practices**.
- Follow **Ionic best practices**.
- Prefer **simple, readable, composable solutions**.
- Keep the UI consistent with the app’s design system and theme.
- Respect the separation of responsibilities between the frontend, Supabase, and the custom backend API.

## Frontend Standards

### Angular
- Use **standalone components** by default.
- Use **inline templates** and **inline styles** unless explicitly instructed otherwise.
- Follow Angular style guide conventions for:
  - naming
  - dependency injection
  - routing
  - state flow
  - lifecycle management
  - RxJS usage
- Prefer **strong typing** everywhere.
- Avoid `any` unless there is a clear and justified reason.
- Keep components lean and move logic into appropriate services/utilities when needed.
- Prefer reactive patterns over imperative workarounds.
- Clean up subscriptions appropriately.
- Favor Angular built-in capabilities before introducing additional libraries.

### Ionic
- Use **Ionic UI components** whenever possible instead of raw HTML controls.
- Follow Ionic patterns for:
  - layout
  - navigation
  - forms
  - modals
  - alerts
  - toasts
  - loading states
- Ensure UI works well on both **mobile and desktop form factors**.
- Build with touch-friendly interactions and responsive behavior in mind.
- Respect platform conventions where appropriate, but maintain consistent product behavior.

## Styling and Theme
- Follow the app theme configuration in `theme/variables.scss`.
- Reuse existing theme tokens, color variables, spacing, and styling conventions before adding new ones.
- Do not introduce one-off visual styles if an existing theme token or Ionic utility can be used.
- Keep styling consistent, minimal, and maintainable.
- Prefer Ionic theming and CSS variables over hardcoded colors and magic numbers.

## Architecture and Boundaries
- Keep a clean separation between:
  - **presentation/UI**
  - **application logic**
  - **data access**
  - **storage and backend integrations**
- Do not mix backend communication logic directly into UI components when it should live in a service.
- Prefer feature-oriented organization when adding new functionality.
- Avoid large monolithic components or services.

### Supabase vs Custom Backend API
When implementing data flows, respect the intended boundaries:

- Use **Supabase** only for responsibilities it is meant to handle in this project.
- Use the **custom backend API** for business logic, orchestration, validation, and any sensitive operations that should not live purely in the frontend.
- If the correct boundary is unclear, prefer putting sensitive or business-critical logic behind the custom backend API rather than in the client.

## Security Requirements
Arcana Vault is a security-sensitive application. Treat all storage and file-handling features accordingly.

- Never hardcode secrets, tokens, API keys, or service credentials.
- Never expose privileged backend or Supabase service credentials in frontend code.
- Assume all client code is inspectable by end users.
- Prefer secure-by-default implementations.
- Validate inputs rigorously.
- Be cautious with file uploads, previews, metadata handling, and download flows.
- Avoid insecure direct object reference patterns.
- Respect authentication and authorization boundaries.
- If using Supabase storage or database features, design with least privilege in mind.
- Prefer patterns compatible with row-level security and secure access control.
- Avoid logging sensitive user or file data.
- Do not store sensitive information in insecure client-side persistence unless explicitly required and approved.

## File and Media Handling
Because this app stores videos, images, and documents:

- Be mindful of file size, upload progress, retry behavior, and failure states.
- Provide clear UX for:
  - upload state
  - processing state
  - success/error feedback
  - empty states
- Consider performance implications for large media files.
- Avoid loading unnecessarily large assets into memory.
- Prefer efficient preview and streaming-friendly approaches where possible.
- Preserve privacy when generating previews or metadata displays.

## PWA Expectations
This is a Progressive Web App, so implementations should consider:

- responsive design
- installability
- offline-aware behavior where appropriate
- graceful handling of unstable networks
- caching strategies that do not compromise data correctness or security
- good performance on mobile devices

Do not introduce caching or offline behavior for sensitive data without considering security and freshness implications.

## Code Quality
- Keep code concise, readable, and easy to reason about.
- Avoid duplication; extract reusable pieces when justified.
- Do not over-abstract prematurely.
- Match the existing codebase style and conventions when editing existing files.
- Prefer explicitness over hidden behavior.
- Add comments only when they provide real value.
- Do not leave dead code, commented-out blocks, or placeholder implementations unless explicitly requested.

## Testing and Validation
After creating or editing code, always run:

```bash
npm run lint
```

Rules:
- Fix lint issues introduced by your changes.
- Do not ignore lint errors without a documented reason.
- If additional validation commands already exist in the project, prefer running them when relevant.

## Definition of Done
A task is only considered complete when all of the following are true:

- The implementation follows Angular and Ionic best practices.
- The UI uses Ionic components where appropriate.
- New components are standalone and use inline template/style unless explicitly told otherwise.
- Styling respects `theme/variables.scss`.
- Code is consistent with the existing architecture.
- Security implications have been considered.
- `npm run lint` has been run after the changes.
- Any important assumptions or tradeoffs are clearly communicated.

## Agent Behavior Expectations
- Make the smallest reasonable change that fully solves the problem.
- Do not make broad architectural changes unless explicitly requested.
- Ask for clarification if:
  - requirements conflict
  - security boundaries are unclear
  - the intended responsibility between Supabase and the backend API is ambiguous
  - a change could affect authentication, authorization, or file access rules
- When suggesting improvements, prefer practical recommendations over speculative refactors.

## Preferred Implementation Patterns
- Standalone Angular components
- Inline templates and inline styles
- Typed services for API/data access
- Reusable UI patterns with Ionic primitives
- Feature-based separation of concerns
- Secure and explicit file handling flows
- Consistent loading, error, and empty states

## Avoid
- Raw HTML controls when Ionic components are appropriate
- Business logic embedded directly in page components
- Hardcoded theme values when existing theme tokens can be used
- Unstructured state management
- Leaking sensitive data into logs, client storage, or frontend configuration
- Overengineering simple features
- Introducing dependencies without clear justification

## If Unsure
If implementation details are unclear, prefer:
1. security
2. simplicity
3. maintainability
4. consistency with the existing codebase

When in doubt, ask for clarification before making risky or irreversible changes.
