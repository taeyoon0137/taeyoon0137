#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PACKAGE_JSON_FILE="$ROOT_DIR/package.json"
README_FILE="$ROOT_DIR/README.md"
PRESET_README_FILE="$ROOT_DIR/resources/README.preset.md"
PRESET_HERO_FILE="$ROOT_DIR/resources/readme-hero.preset.svg"
HERO_FILE="$ROOT_DIR/resources/readme-hero.svg"
INEDIT_LOGO_FILE="$ROOT_DIR/resources/assets/logos/inedit.svg"
VENDIT_LOGO_FILE="$ROOT_DIR/resources/assets/logos/vendit.svg"
WHATSSUB_LOGO_FILE="$ROOT_DIR/resources/assets/logos/whatssub.svg"

if [ ! -f "$PRESET_README_FILE" ]; then
  echo "Error: README.preset.md file not found at $PRESET_README_FILE"
  exit 1
fi

if [ ! -f "$PRESET_HERO_FILE" ]; then
  echo "Error: readme-hero.preset.svg file not found at $PRESET_HERO_FILE"
  exit 1
fi

PROJECT_NAME="$(basename "$ROOT_DIR")"
DISPLAY_NAME="$PROJECT_NAME"
VERSION=""
REPOSITORY_URL=""
PACKAGE_MANAGER=""

if [ -f "$PACKAGE_JSON_FILE" ]; then
  PACKAGE_INFO=""
  if command -v node >/dev/null 2>&1; then
    PACKAGE_INFO="$(node -e '
const packageJson = require(process.argv[1]);
const repository = packageJson.repository;
const repositoryUrl = typeof repository === "string" ? repository : repository?.url ?? "";
process.stdout.write([
  packageJson.name ?? "",
  packageJson.version ?? "",
  packageJson.packageManager ?? "",
  repositoryUrl,
].join("\n"));
' "$PACKAGE_JSON_FILE")"
  elif command -v jq >/dev/null 2>&1; then
    PACKAGE_INFO="$(jq -r '
      [
        (.name // ""),
        (.version // ""),
        (.packageManager // ""),
        ((.repository // "") | if type == "string" then . else (.url // "") end)
      ] | .[]
    ' "$PACKAGE_JSON_FILE")"
  fi

  if [ -n "$PACKAGE_INFO" ]; then
    PKG_NAME="$(printf "%s" "$PACKAGE_INFO" | sed -n '1p')"
    VERSION="$(printf "%s" "$PACKAGE_INFO" | sed -n '2p')"
    PACKAGE_MANAGER="$(printf "%s" "$PACKAGE_INFO" | sed -n '3p')"
    REPOSITORY_URL="$(printf "%s" "$PACKAGE_INFO" | sed -n '4p')"

    if [ -n "$PKG_NAME" ]; then
      PROJECT_NAME="$PKG_NAME"
      DISPLAY_NAME="$PROJECT_NAME"
    fi
  fi
fi

if [ -z "$REPOSITORY_URL" ]; then
  REPOSITORY_URL="$(git -C "$ROOT_DIR" config --get remote.origin.url || true)"
fi

REPOSITORY_URL="${REPOSITORY_URL#git+}"
REPOSITORY_URL="${REPOSITORY_URL%.git}"
REPOSITORY_URL="${REPOSITORY_URL/git@github.com:/https:\/\/github.com\/}"

BADGE_LINES=""

if [ -n "$VERSION" ]; then
  BADGE_LINES="$BADGE_LINES
  <a href=\"$REPOSITORY_URL\"><img src=\"https://img.shields.io/badge/$VERSION-%23101010?label=$PROJECT_NAME&labelColor=%234D24E2\" /></a>"
else
  BADGE_LINES="$BADGE_LINES
  <a href=\"https://git-scm.com/\"><img src=\"https://img.shields.io/badge/git-%23F05032?&logo=git&logoColor=%23FFFFFF\" /></a>"
fi

if [ -n "$PACKAGE_MANAGER" ]; then
  PACKAGE_MANAGER_NAME="${PACKAGE_MANAGER%@*}"

  case "$PACKAGE_MANAGER_NAME" in
    pnpm)
      BADGE_LINES="$BADGE_LINES
  <a href=\"https://pnpm.io/\"><img src=\"https://img.shields.io/badge/pnpm-%23F69220?&logo=pnpm&logoColor=%23FFFFFF\" /></a>"
      ;;
    npm)
      BADGE_LINES="$BADGE_LINES
  <a href=\"https://www.npmjs.com/\"><img src=\"https://img.shields.io/badge/npm-%23CB3837?&logo=npm&logoColor=%23FFFFFF\" /></a>"
      ;;
    yarn)
      BADGE_LINES="$BADGE_LINES
  <a href=\"https://yarnpkg.com/\"><img src=\"https://img.shields.io/badge/yarn-%232C8EBB?&logo=yarn&logoColor=%23FFFFFF\" /></a>"
      ;;
    *)
      BADGE_LINES="$BADGE_LINES
  <img src=\"https://img.shields.io/badge/$PACKAGE_MANAGER_NAME-%23101010\" />"
      ;;
  esac
fi

BADGE_LINES="$BADGE_LINES
  <a href=\"https://www.markdownguide.org/\"><img src=\"https://img.shields.io/badge/markdown-%23000000?&logo=markdown&logoColor=%23FFFFFF\" /></a>"

BADGE_BLOCK="<p align=\"center\">$BADGE_LINES
</p>"

# Encode badge logo SVGs as URL-safe base64 strings for inline use in shields.io badge URLs.
encode_logo_symbol() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo ""
    return
  fi
  perl -MMIME::Base64=encode_base64 -MURI::Escape=uri_escape -e '
    my $file = $ARGV[0];
    open my $fh, "<:raw", $file or die "Error: failed to read $file: $!";
    local $/;
    my $bytes = <$fh>;
    close $fh;
    my $b64 = encode_base64($bytes, "");
    print uri_escape($b64);
  ' "$file"
}

INEDIT_SYMBOL="$(encode_logo_symbol "$INEDIT_LOGO_FILE")"
VENDIT_SYMBOL="$(encode_logo_symbol "$VENDIT_LOGO_FILE")"
WHATSSUB_SYMBOL="$(encode_logo_symbol "$WHATSSUB_LOGO_FILE")"

perl -MMIME::Base64=encode_base64 -0pe '
  BEGIN {
    ($root_dir, $project_name) = @ARGV;
    @ARGV = @ARGV[2..$#ARGV];

    %mime_by_ext = (
      jpg => "image/jpeg",
      jpeg => "image/jpeg",
      png => "image/png",
    );
  }

  sub escape_xml {
    my ($text) = @_;
    $text =~ s/&/&amp;/g;
    $text =~ s/</&lt;/g;
    $text =~ s/>/&gt;/g;
    return $text;
  }

  sub embed_image {
    my ($tag, $file_name) = @_;
    my $path = "$root_dir/resources/$file_name";
    return "" unless -f $path;

    my ($ext) = $file_name =~ /\.([^.]+)$/;
    $ext = lc($ext // "");
    my $mime = $mime_by_ext{$ext};
    return "" unless $mime;

    open my $image, "<:raw", $path or die "Error: failed to read $path: $!";
    local $/;
    my $bytes = <$image>;
    close $image;

    my $data_uri = "data:$mime;base64," . encode_base64($bytes, "");
    $tag =~ s|href="\./\Q$file_name\E"|href="$data_uri"|;
    return $tag;
  }

  s|(<text class="r"[^>]*>)(.*?)(</text>)|$1 . escape_xml($project_name) . $3|e;
  s|<image\b(?=[^>]*\bhref="\./([^"]+)")[^>]*/>|embed_image($&, $1)|ge;
' "$ROOT_DIR" "$PROJECT_NAME" "$PRESET_HERO_FILE" > "$HERO_FILE"

perl -0pe '
  BEGIN {
    ($project_name, $display_name, $repository_url, $badge_block, $inedit_symbol, $vendit_symbol, $whatssub_symbol) = @ARGV;
    @ARGV = @ARGV[7..$#ARGV];
  }

  s/\$\{projectName\}/$project_name/g;
  s/\$\{displayName\}/$display_name/g;
  s/\$\{repositoryUrl\}/$repository_url/g;
  s/\$\{badgeBlock\}/$badge_block/g;
  s/\{\{KEY_INEDIT\}\}/$inedit_symbol/g;
  s/\{\{KEY_VENDIT\}\}/$vendit_symbol/g;
  s/\{\{KEY_WHATSSUB\}\}/$whatssub_symbol/g;
  s|\.\./resources|./resources|g;
  s|\.\./docs|./docs|g;
  s|\.\./AGENTS\.md|./AGENTS.md|g;
  s|\.\./CLAUDE\.md|./CLAUDE.md|g;
' "$PROJECT_NAME" "$DISPLAY_NAME" "$REPOSITORY_URL" "$BADGE_BLOCK" "$INEDIT_SYMBOL" "$VENDIT_SYMBOL" "$WHATSSUB_SYMBOL" "$PRESET_README_FILE" > "$README_FILE"

if command -v prettier >/dev/null 2>&1; then
  prettier --write --log-level warn "$README_FILE" >/dev/null
elif [ -x "$ROOT_DIR/node_modules/.bin/prettier" ]; then
  "$ROOT_DIR/node_modules/.bin/prettier" --write --log-level warn "$README_FILE" >/dev/null
elif command -v yarn >/dev/null 2>&1 && [ -f "$ROOT_DIR/package.json" ]; then
  (cd "$ROOT_DIR" && yarn prettier --write --log-level warn "$README_FILE" >/dev/null 2>&1) || true
fi

echo "README.md and readme-hero.svg updated successfully"
