#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Wait for the database to be ready.
until psql "$DATABASE_URL" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing commands"

# Run database migrations.
>&2 echo "Running database migrations..."
migrate -path /app/db/migrations -database "$DATABASE_URL" -verbose up

# Check if the users table is empty before seeding.
USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;")

# Trim whitespace from USER_COUNT
USER_COUNT=$(echo $USER_COUNT | xargs)

if [ "$USER_COUNT" -eq 0 ]; then
  >&2 echo "Users table is empty. Seeding initial data..."
  psql "$DATABASE_URL" -a -f /app/db/seed/001_initial_data.sql
else
  >&2 echo "Users table already contains data. Skipping seed."
fi

# Execute the main container command (e.g., 'air').
exec "$@"
