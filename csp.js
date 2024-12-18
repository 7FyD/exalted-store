const policies = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://checkout.stripe.com",
    "https://js.stripe.com",
    "https://maps.googleapis.com",
  ],
  "child-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": [
    "'self'",
    "https://*.stripe.com",
    "https://raw.githubusercontent.com",
    "https://mineskin.eu",
  ],
  "font-src": ["'self'"],
  "frame-src": [
    "'self'",
    "https://checkout.stripe.com",
    "https://js.stripe.com",
    "https://hooks.stripe.com",
  ],
  "connect-src": [
    "'self'",
    "https://checkout.stripe.com",
    "https://api.stripe.com",
    "https://maps.googleapis.com",
    "http://65.108.249.37:3001",
  ],
};

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(" ")}`;
    }
    return "";
  })
  .join("; ");
