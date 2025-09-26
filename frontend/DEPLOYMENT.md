# Deployment Instructions

## Environment Variables

Before deploying, make sure to set the following environment variable:

### For Development
```bash
REACT_APP_API_BASE_URL=http://localhost:5000
```

### For Production
```bash
REACT_APP_API_BASE_URL=https://your-backend-domain.com
```

## Deployment Steps

1. **Set Environment Variable**: Set the `REACT_APP_API_BASE_URL` environment variable to your production backend URL.

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Deploy the Build Folder**: The `build` folder contains all the static files needed for deployment.

## Common Deployment Platforms

### Netlify
- Set environment variable in Netlify dashboard
- Deploy the `build` folder

### Vercel
- Set environment variable in Vercel dashboard
- Deploy the `build` folder

### GitHub Pages
- Set environment variable in GitHub Actions or repository settings
- Deploy the `build` folder

## Important Notes

- The app uses `BrowserRouter` which requires server-side routing configuration for production
- Make sure your backend CORS is configured to allow requests from your frontend domain
- All API calls are now configurable via the `REACT_APP_API_BASE_URL` environment variable
