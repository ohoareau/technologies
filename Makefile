export CI
export FORCE_COLOR

build: ## Execute the build on all the packages
	@yarn --silent lerna run build --stream

changed: ## Display all changed packages since last publish
	@yarn --silent lerna changed

clean: clean-lib clean-modules clean-coverage clean-buildinfo
clean-buildinfo: ## Remove the Typescript cache file for compilation
	@find packages/ -name tsconfig.tsbuildinfo -exec rm -rf {} +
clean-coverage: ## Remove test coverage directory
	@rm -rf coverage/
	@find packages/ -name coverage -type d -exec rm -rf {} +
clean-lib: ## Remove the Typescript generated directory containing transpiled files
	@find packages/ -name lib -type d -exec rm -rf {} +
clean-modules: ## Remove Javascript dependencies directory
	@rm -rf node_modules/
	@find packages/ -name node_modules -type d -exec rm -rf {} +

generate: ## Generate and synchronize the source code using GenJS
	@yarn --silent genjs

install: install-root install-packages build
install-packages: ## Install the dependencies of all packages using Lerna
	@yarn --silent lerna bootstrap
install-root: ## Install the Javascript dependencies
	@yarn --silent install

package-build: ## Build
	@cd packages/$(p) && yarn --silent build
package-clear-test: ## Clear test cache
	@cd packages/$(p) && yarn --silent jest --clearCache
package-install: ## Install the dependencies of all packages using Lerna
	@yarn --silent lerna bootstrap --scope @ohoareau/$(p)
package-test: package-build ## Execute the tests
	@cd packages/$(p) && yarn --silent test --coverage --detectOpenHandles

publish: ## Publish all changed packages
	@yarn --silent lerna publish

test: build test-only
test-local: ## Execute the tests
	@yarn --silent test --coverage --detectOpenHandles
test-only: ## Execute the tests
	@yarn --silent test --runInBand --coverage --detectOpenHandles

.DEFAULT_GOAL := install
.PHONY: build \
		changed \
		clean clean-buildinfo clean-coverage clean-lib clean-modules \
		generate \
		install install-packages install-root \
		package-build package-clear-test package-install package-test \
		publish \
		test test-local test-only