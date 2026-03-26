#!/bin/sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

generate() {
  if [ $# -ne 2 ] || [ -z "$1" ] || [ -z "$2" ]; then
    exit 10
  fi

  local source_dir="${SCRIPT_DIR}/$1"
  local target_path="${SCRIPT_DIR}/$2"

  if [ ! -d "$source_dir" ]; then
    exit 20
  fi

  local parts_path=$(mktemp)

  if [ -n "$(ls "$source_dir")" ]; then
    for file_path in "$source_dir"/*; do
      local file_name="$(basename "$file_path")"
      local file_body="$(base64 "$file_path")"

      echo "  '${file_name}'," >> "$parts_path"
      echo "  \`${file_body}\`," >> "$parts_path"
      echo >> "$parts_path"
    done
  else
    touch "$parts_path"
  fi

  local parts_body=$(cat "$parts_path")

  cat > "$target_path" << EOF
// Auto-generated file. Do not edit manually!

// prettier-ignore
const ASSETS: string[] = [
${parts_body}
]

export function makeAssets(): [string, string][] {
  const entries: [string, string][] = []

  for (let idx = 0; idx < ASSETS.length; idx += 2) {
    const name = ASSETS[idx]
    const body = ASSETS[idx + 1]

    if (name && body) {
      const data = Buffer.from(body, 'base64').toString()
      entries.push([name, data])
    }
  }

  return entries
}
EOF

  rm -f "$parts_path"
}

generate "assets/console" "src/console/assets.ts"
generate "assets/reverse" "src/reverse/assets.ts"
generate "assets/analyze" "src/analyze/assets.ts"

exit 0
