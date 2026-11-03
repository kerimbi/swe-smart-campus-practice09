## Project
Smart Campus room availability checker; one room, fictional data.

## Structure
- src/App.tsx: UI and form state
- src/components/TimeRequestForm.tsx, BookingsList.tsx, ResultMessage.tsx: UI components
- src/lib/availability.ts: pure booking rules (checkAvailability and helper checks)
- src/lib/availability.test.ts: regression tests
- src/lib/constants.ts: shared fixed time, room name, bookings and day limit (to be created in the refactoring)

## Constraints
Preserve AC1-AC6; no backend, login or booking creation.
AC1 start < end and not in the past; AC2 max 120 minutes; AC3 blocked room rejected;
AC4 overlaps rejected, touching endpoints allowed; AC5 no mutation of bookings; AC6 clear responsive feedback.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns (zero is fine).
Do not mutate booking fixtures; keep responsive UI feedback.
Do not weaken or delete existing test assertions.
Forbidden: new features, new rooms, database, login, API calls, rewriting the UI.

## Commands
Run tests: npm test
Start preview: npm run dev

## Verification
Run existing tests and add focused regression tests.
Report changed files, rationale and test evidence.