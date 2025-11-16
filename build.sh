set -e

PROD_URL="https://modernactuary.co.za"
DEV_URL="http://localhost:5173"

export PUBLIC_SITE_URL="$DEV_URL"

if [ "$CF_PAGES" = 1 ]; then
  echo "Detected Cloudflare Pages environment."
  if [ "$CF_PAGES_BRANCH" = "main" ]; then
    echo "Building for production branch..."
    export PUBLIC_SITE_URL="$PROD_URL"
  else
    echo "Building for preview branch: $CF_PAGES_BRANCH"
    export PUBLIC_SITE_URL="$CF_PAGES_URL"
  fi

elif [ "$1" = "--production" ]; then
  echo "Building for local production..."
  export PUBLIC_SITE_URL="$PROD_URL"
fi

# Log the final URL being used and execute the build.
echo "Using site URL: $PUBLIC_SITE_URL"
pnpm run build:kit