#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/run-e2e.sh [ref]
# Example: ./scripts/run-e2e.sh main

REPO="GonzaloOrellanaC/plataforma-mantencion"
REF="${1:-main}"

echo "Dispatching e2e workflow for ${REPO}@${REF}"
gh workflow run e2e.yml --repo "${REPO}" --ref "${REF}"
echo "Workflow dispatched. Use 'gh run list --repo ${REPO}' to monitor runs."
