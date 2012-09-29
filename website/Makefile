# FOREVER = ./node_modules/.bin/forever
# WAIT_FOR_SERVER   = sleep 5 # FIXME - use something more elegant
# TEST_SERVER = tests/test-server.js
# TEST_SERVER = server.js
# STOP_TEST_SERVER  = $(FOREVER) stop $(TEST_SERVER)
# START_TEST_SERVER = $(STOP_TEST_SERVER); NODE_ENV=testing $(FOREVER) start $(TEST_SERVER) && $(WAIT_FOR_SERVER)


all: node-modules css


node-modules:
	npm install
	npm prune


npm-update:
	rm npm-shrinkwrap.json
	npm install
	npm update
	npm prune
	npm shrinkwrap


npm-shrinkwrap:
	npm install
	rm npm-shrinkwrap.json
	npm install
	npm prune
	npm shrinkwrap

css:
	# compass compile


optipng:
	find public -name '*.png' | xargs optipng --clobber -o4


test: node-modules test-sales-app test-browser
	echo "ALL TESTS PASSED"

test-sales-app:
	cd apps/sales; mocha --reporter list

test-browser: css
	# $(START_TEST_SERVER)
	@NODE_ENV=testing ruby tests/browser/run_tests.rb -v
	# $(STOP_TEST_SERVER)

clean:
	compass clean
	find . -name chromedriver.log -delete
