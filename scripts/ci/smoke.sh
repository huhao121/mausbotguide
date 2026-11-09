#!/usr/bin/env bash
# Smoke-test a deployed site. Usage: smoke.sh <base-url> [expected-build-id]
# Retries for ~3 minutes so a fresh custom domain or edge cache can settle.
set -euo pipefail
base="${1:?base url required}"; base="${base%/}"
expect_build="${2:-}"
paths=("/" "/zh/" "/sitemap-index.xml" "/robots.txt")
attempts=12; delay=15

check() {
	local p status
	for p in "${paths[@]}"; do
		status="$(curl -s -o /dev/null -w '%{http_code}' "$base$p")"
		if [[ "$status" != "200" ]]; then echo "  $p -> $status"; return 1; fi
	done
	if [[ -n "$expect_build" ]]; then
		# Fetch first: `curl | grep -q` fails under pipefail when grep exits on the first match.
		local home
		home="$(curl -fsS "$base/")" || { echo "  / could not be fetched"; return 1; }
		if ! grep -q "name=\"x-build\" content=\"$expect_build\"" <<<"$home"; then
			echo "  / does not serve build $expect_build yet"; return 1
		fi
	fi
}

for ((i = 1; i <= attempts; i++)); do
	echo "Smoke test $i/$attempts against $base"
	if check; then echo "Smoke test passed"; exit 0; fi
	(( i < attempts )) && sleep "$delay"
done
echo "Smoke test failed" >&2
exit 1
