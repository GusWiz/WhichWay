.PHONY: fmt install-hooks

fmt:
	@echo " "
	@echo "Running Python Hooks ..."
	pre-commit run --all-files
	@echo " "
	@echo "Running Frontend Hooks ..."
	npx prettier . --write

install-hooks:
	pre-commit install
