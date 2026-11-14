# Account-a-Day — final backend handoff

## Files and functionality

| File | Purpose |
|---|---|
| `api.php` | Main JSON endpoint used by the frontend (`?action=signup`, `login`, `logout`, `session`, `coaches`, `data`, `goal_create`, `goal_coach`, `milestone_add`, `milestone_status`, `milestone_delete`, `message`, `review`, `profile`). Keep this exact name. |
| `db_connect.php` | Shared mysqli connection to the local `account_a_day` database. Keep this exact name. |
| `get_goals.php` | Optional legacy JSON goal list; restricted to the logged-in customer, unlike the earlier unrestricted version. |
| `create_coach_cli.php` | Creates instructor accounts with hashed passwords. Run from terminal only; never expose on a public host. |
| `account_a_day_complete_schema.sql` | Complete fresh-install schema: users, goals, provider_schedules, appointments, reviews, milestones, messages, user_profiles. |

## Installation

1. This package is for teammates starting without a backend/database. If you already have an account_a_day database, back it up first.
2. Place the PHP files in the same directory as your frontend's `index.html` (typically `/Applications/XAMPP/xamppfiles/htdocs/account-a-day/`). Do not rename `api.php` or `db_connect.php`.
3. Start Apache and MySQL in XAMPP. Check the username/password in `db_connect.php` for your computer.
4. Import the single `account_a_day_complete_schema.sql` file in phpMyAdmin to create the complete `account_a_day` database and all required tables. Do not use this as an upgrade for an existing populated database.
5. Check `http://localhost/account-a-day/api.php?action=session` and `http://localhost/account-a-day/api.php?action=coaches`.
6. Sign up and log in from the frontend. To create a coach, run from the project directory:
   `/Applications/XAMPP/xamppfiles/bin/php create_coach_cli.php 'Marcus Vance' 'marcus@example.com' 'replace-with-strong-password'`
   Repeat for additional coaches with their own unique emails. This does not insert fictional profiles automatically.
7. Confirm the coach list returns records, create a goal, assign a coach, add milestones as a coach, and refresh to verify persistence.

## Important integration notes

- This package contains backend PHP/SQL only. Your teammates must retain the frontend HTML, CSS, `js/script.js`, and `js/backend.js` that call `api.php`.
- Filenames required by the existing frontend have been retained. The available backend was checked for PHP syntax, but live integration with your teammates' latest JavaScript and database has **not** been verified.
- The coach directory is populated from users with role `instructor`. An empty `coaches` array means no instructor users are in the database (or you are connecting to the wrong database).
- The UI/API supports verified reviews only after a completed appointment exists; booking itself is not implemented in the supplied API.
- The application is a local classroom prototype, not production hardened. Add CSRF defenses, HTTPS/secure cookies, rate limiting, audit logs and authorization review before public deployment.
- Do not upload the CLI coach-creation script to public hosting. Billing is demo-only.
