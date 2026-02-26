# Hosting Tessl Onboarding Web Endpoint

This directory contains files for serving the Tessl onboarding at `tessl.io/onboard`.

## Files

- `index.html` - Human-friendly landing page
- `onboard.md` - The core markdown guide (copy of TESSL_ONBOARDING.md)

## Hosting Setup

### Static Hosting (Recommended)

**Option 1: Vercel**
```bash
npm install -g vercel
cd web/
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
cd web/
netlify deploy --prod
```

**Option 3: GitHub Pages**
```bash
# Push web/ directory to gh-pages branch
git subtree push --prefix web origin gh-pages
```

### Server Configuration

**Required Headers:**

For `/onboard.md`:
```
Content-Type: text/markdown; charset=utf-8
X-Agent-Consumable: true
Cache-Control: public, max-age=3600
```

**Example Nginx Config:**
```nginx
location /onboard.md {
  add_header Content-Type "text/markdown; charset=utf-8";
  add_header X-Agent-Consumable "true";
  add_header Cache-Control "public, max-age=3600";
  alias /path/to/TESSL_ONBOARDING.md;
}

location / {
  try_files $uri $uri/ /index.html;
}
```

**Example Vercel Config (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/onboard.md",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/markdown; charset=utf-8"
        },
        {
          "key": "X-Agent-Consumable",
          "value": "true"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ],
  "routes": [
    {
      "src": "/onboard.md",
      "dest": "/onboard.md"
    }
  ]
}
```

## Testing

**Test human page:**
```bash
open http://localhost:3000
# or
curl http://localhost:3000
```

**Test agent endpoint:**
```bash
curl -I http://localhost:3000/onboard.md
# Should see Content-Type: text/markdown and X-Agent-Consumable: true
```

**Test agent fetch:**
```bash
curl http://localhost:3000/onboard.md | head -n 20
# Should see markdown content
```

## Production URLs

- Human page: `https://tessl.io/onboard`
- Agent endpoint: `https://tessl.io/onboard.md`

## CDN Caching

Enable CDN caching for performance:
- Cache `/onboard.md` for 1 hour (3600s)
- Invalidate cache on updates
- Use ETags for conditional requests

## Monitoring

Monitor:
- Fetch success rate
- Average response time
- 404 errors (indicates broken links)
- Agent vs human traffic ratio
