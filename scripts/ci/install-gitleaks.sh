#!/usr/bin/env bash
# Install a pinned gitleaks binary on a Linux x64 CI runner, verifying its checksum.
set -euo pipefail
VERSION="${GITLEAKS_VERSION:-8.30.1}"
base="https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}"
tarball="gitleaks_${VERSION}_linux_x64.tar.gz"
tmp="$(mktemp -d)"
curl -fsSL -o "$tmp/$tarball" "$base/$tarball"
curl -fsSL -o "$tmp/checksums.txt" "$base/gitleaks_${VERSION}_checksums.txt"
(cd "$tmp" && grep " ${tarball}\$" checksums.txt | sha256sum -c -)
tar -xzf "$tmp/$tarball" -C "$tmp" gitleaks
sudo install -m 0755 "$tmp/gitleaks" /usr/local/bin/gitleaks
gitleaks version
