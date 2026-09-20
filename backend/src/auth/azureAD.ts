import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = Router();

// Azure AD Configuration
const AZURE_AD_TENANT = process.env.AZURE_AD_TENANT || 'common';
const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const AZURE_AD_CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://trchr.trcclininc.com.au/auth/callback';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Step 1: Redirect to Azure AD login
router.get('/login/azuread', (req: Request, res: Response) => {
  const authUrl = `https://login.microsoftonline.com/${AZURE_AD_TENANT}/oauth2/v2.0/authorize`;

  const params = new URLSearchParams({
    client_id: AZURE_AD_CLIENT_ID || '',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    prompt: 'login',
  });

  res.redirect(`${authUrl}?${params.toString()}`);
});

// Step 2: Handle Azure AD callback
router.get('/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: error || 'Authentication failed' });
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code received' });
  }

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${AZURE_AD_TENANT}/oauth2/v2.0/token`,
      {
        client_id: AZURE_AD_CLIENT_ID,
        client_secret: AZURE_AD_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        scope: 'openid profile email',
      }
    );

    const { id_token, access_token } = tokenResponse.data;

    // Decode token to get user info
    const decoded = jwt.decode(id_token) as any;

    const user = {
      id: decoded.oid,
      email: decoded.email || decoded.upn,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      role: getRole(decoded.email), // Determine role from email/groups
    };

    // Generate app token
    const appToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    res.redirect(`https://trchr.trcclininc.com.au?token=${appToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out. Redirect to: https://login.microsoftonline.com/common/oauth2/v2.0/logout' });
});

// Helper: Determine role from email domain or Azure AD groups
function getRole(email: string): 'staff' | 'manager' | 'director' {
  if (email.includes('director')) return 'director';
  if (email.includes('manager')) return 'manager';
  return 'staff';
}

export default router;
