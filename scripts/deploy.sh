#!/usr/bin/env bash
set -euo pipefail

project_dir=/srv/docker/projects/plan90/app
backup_dir=/srv/docker/backups/plan90

test "$(pwd -P)" = "$project_dir"
install -d -m 750 "$backup_dir"

if [ -f "$project_dir/data/plan90.json" ]; then
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  cp "$project_dir/data/plan90.json" "$backup_dir/plan90-$timestamp.json"
fi

git fetch origin refs/heads/main:refs/remotes/origin/main
git checkout -B main origin/main
docker compose up -d --build --remove-orphans

for attempt in $(seq 1 18); do
  health="$(docker inspect --format '{{.State.Health.Status}}' plan90 2>/dev/null || true)"
  if [ "$health" = healthy ]; then
    exit 0
  fi
  sleep 5
done

docker compose logs --tail=100 plan90
exit 1
