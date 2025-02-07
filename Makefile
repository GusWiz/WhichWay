.PHONY: fmt install-hooks

# Run the formatters defined in .pre-commit-config.yaml
fmt:
	pre-commit run --all-files

# Install pre-commit hooks (optional)
install-hooks:
	pre-commit install
