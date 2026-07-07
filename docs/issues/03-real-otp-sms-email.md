# Replace dev OTP with real SMS/email delivery

**Labels:** `infra`, `feature`, `priority: critical`  
**Milestone:** MVP — usable in Bangalore

## Problem
OTP is logged to the server console in dev (`src/lib/otp.ts`). Crowdsourcing cannot work in production without real verification.

## Tasks
- [ ] Pick provider: MSG91 or Twilio (SMS), Resend or SendGrid (email)
- [ ] Add API keys to production env (never commit)
- [ ] Update `sendOtp()` in `src/lib/otp.ts` to call provider
- [ ] Keep console fallback only when `NODE_ENV=development`
- [ ] Test submit flow end-to-end on prod with real phone/email
- [ ] Rate-limit OTP sends (prevent spam abuse)

## Acceptance criteria
- User receives OTP on phone or email in production
- Invalid/expired OTP still rejected
- No OTP values logged in prod

## Files
- `src/lib/otp.ts`
- `src/app/api/otp/send/route.ts`
- `src/app/api/otp/verify/route.ts`
