.PHONY: fmt install-hooks .venv

TOOLS_DIR ?= tools

# Ensure virtual environment is created and dependencies installed
.venv: ## Create a virtual environment
	@echo "Creating virtual environment..."
	@$(MAKE) uv
	@$(UV) venv
#	@$(UV) pip install --requirement pyproject.toml

.PHONY: pre-commit-install
pre-commit-install: .venv ## Install pre-commit hooks
	@echo "Installing pre-commit hooks..."
	@$(UVX) pre-commit install > /dev/null

.PHONY: fmt
fmt: pre-commit-install ## Lint and format files
	@echo "Running Python Hooks..."
	$(UVX) pre-commit run --all-files
	@echo "Running Frontend Hooks..."
	npx prettier . --write

### Tool Versions
UV_VERSION ?= 0.5.24

UV_DIR ?= $(TOOLS_DIR)/uv-$(UV_VERSION)
UV ?= $(UV_DIR)/uv
UVX ?= $(UV_DIR)/uvx

# Ensure TOOLS_DIR exists before downloading uv
$(TOOLS_DIR):
	@mkdir -p $(TOOLS_DIR)

.PHONY: uv
uv: $(UV) ## Download uv
$(UV): $(TOOLS_DIR)
	@mkdir -p $(UV_DIR)
	@test -s $(UV) || { curl -LsSf https://astral.sh/uv/$(UV_VERSION)/install.sh | UV_INSTALL_DIR=$(UV_DIR) sh > /dev/null; }


#fmt:
#	@echo " "
#	@echo "Running Python Hooks ..."
#	pre-commit run --all-files
#	@echo " "
#	@echo "Running Frontend Hooks ..."
#	npx prettier . --write
#
#install-hooks:
#	pre-commit install
