#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INNER_APP_DIR="$ROOT_DIR/Handmade Products Marketplace App"
BACKUP_DIR="$ROOT_DIR/.cleanup-backup-$(date +%Y%m%d-%H%M%S)"
DRY_RUN=true

if [[ "${1:-}" == "--apply" ]]; then
  DRY_RUN=false
fi

log() {
  printf '%s\n' "$1"
}

run_cmd() {
  if $DRY_RUN; then
    log "[dry-run] $*"
  else
    "$@"
  fi
}

require_path() {
  local target="$1"
  if [[ ! -e "$target" ]]; then
    log "Missing expected path: $target"
    exit 1
  fi
}

move_with_backup() {
  local source="$1"
  local destination="$2"

  if [[ ! -e "$source" ]]; then
    return
  fi

  if [[ -e "$destination" ]]; then
    run_cmd mkdir -p "$BACKUP_DIR"
    run_cmd mv "$destination" "$BACKUP_DIR/"
  fi

  run_cmd mv "$source" "$destination"
}

log "Root folder: $ROOT_DIR"
log "Inner app folder: $INNER_APP_DIR"

require_path "$INNER_APP_DIR"
require_path "$INNER_APP_DIR/package.json"

log ""
log "This script will flatten the nested project structure."
log "Default mode is dry-run."
log "Use: ./clean_structure.sh --apply"
log ""

for name in backend dist guidelines node_modules public scripts src index.html package.json package-lock.json tsconfig.json vite.config.ts; do
  move_with_backup "$INNER_APP_DIR/$name" "$ROOT_DIR/$name"
done

for file in start-frontend.bat start-backend.bat start-all.bat README-RUN-FIRST.txt; do
  if [[ -e "$ROOT_DIR/$file" ]]; then
    log "Keeping launcher file in place: $file"
  fi
done

if [[ -d "$INNER_APP_DIR" ]]; then
  if $DRY_RUN; then
    log "[dry-run] rmdir \"$INNER_APP_DIR\""
  else
    rmdir "$INNER_APP_DIR" 2>/dev/null || log "Inner folder not removed automatically. Check for leftover files: $INNER_APP_DIR"
  fi
fi

log ""
if $DRY_RUN; then
  log "Dry-run complete. No files were changed."
else
  log "Cleanup complete."
  if [[ -d "$BACKUP_DIR" ]]; then
    log "Any replaced outer files were backed up to: $BACKUP_DIR"
  fi
fi
