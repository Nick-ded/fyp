# Google Authentication Implementation Checklist

## Pre-Implementation

- [ ] Have Google Client ID and Client Secret from Google Cloud Console
- [ ] Know your frontend port (default: 5173)
- [ ] Know your backend port (default: 8000)
- [ ] Have access to both frontend and backend code

---

## Backend Setup

### Environment Configuration
- [ ] Add `GOOGLE_CLIENT_ID` to `p2/backend/.env`
- [ ] Add `GOOGLE_CLIENT_SECRET` to `p2/backend/.env` (optional, for future use)
- [ ] Verify `.env` file is not committed to git
- [ ] Test that environment variables load correctly

### Dependencies
- [ ] Verify `google-auth==2.26.2` in `requirements.txt`
- [ ] Verify `google-auth-oauthlib==1.2.0` in `