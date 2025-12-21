# Makefile for Abduction: Chaos at The Farm
# Phaser game build and distribution

GAME_NAME = abduction
VERSION = $(shell node -p "require('./package.json').version")
DIST_ZIP = $(GAME_NAME)-$(VERSION).zip

.PHONY: all dev build dist clean preview install help

# Default target
all: build

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Preview production build locally
preview:
	npm run preview

# Create distribution zip for itch.io
dist: build
	@echo "Creating distribution package..."
	@cd docs && zip -r ../$(DIST_ZIP) .
	@echo "Created $(DIST_ZIP)"

# Clean build artifacts
clean:
	rm -rf docs
	rm -f $(GAME_NAME)-*.zip

# Show help
help:
	@echo "Abduction: Chaos at The Farm - Build Targets"
	@echo ""
	@echo "  make install  - Install npm dependencies"
	@echo "  make dev      - Start development server (http://localhost:3000)"
	@echo "  make build    - Build for production (outputs to dist/)"
	@echo "  make preview  - Preview production build locally"
	@echo "  make dist     - Build and create zip for itch.io"
	@echo "  make clean    - Remove build artifacts and zip files"
	@echo "  make help     - Show this help message"
