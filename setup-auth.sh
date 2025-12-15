#!/usr/bin/env bash

# Campus Hub Authentication - Environment Setup Script
# This script helps set up authentication for different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Main
print_header "Campus Hub Authentication Setup"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    print_warning ".env.local already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Setup cancelled"
        exit 1
    fi
fi

# Get Supabase credentials
echo -e "\n${BLUE}Enter your Supabase credentials:${NC}\n"

read -p "Supabase URL: " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    print_error "Supabase URL is required"
    exit 1
fi

read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    print_error "Supabase Anon Key is required"
    exit 1
fi

# Create .env.local
cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Email Configuration (optional - for production)
# VITE_SMTP_HOST=
# VITE_SMTP_PORT=
# VITE_SMTP_USER=
# VITE_SMTP_PASS=

# App Configuration
VITE_APP_NAME=Campus Hub
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_EMAIL_BYPASS=true
EOF

print_success ".env.local created successfully"

# Check Node modules
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found, installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Display next steps
echo -e "\n${GREEN}Setup Complete!${NC}\n"
echo -e "${BLUE}Next Steps:${NC}\n"
echo "1. Start the development server:"
echo -e "   ${YELLOW}npm run dev${NC}\n"
echo "2. Open browser to http://localhost:5173"
echo "3. Go to /auth/signup to create a test account"
echo "4. Or use demo account: demo@test.com / demo123"
echo -e "\n${BLUE}Documentation:${NC}\n"
echo "- Full setup guide: AUTH_SETUP_GUIDE.md"
echo "- Auth system documentation: AUTH_SYSTEM.md"
echo -e "\n${YELLOW}Tips:${NC}\n"
echo "- Email bypass is enabled for development"
echo "- In production, set VITE_ENABLE_EMAIL_BYPASS=false"
echo "- Configure SMTP for real email verification"

print_success "Ready to go!"
