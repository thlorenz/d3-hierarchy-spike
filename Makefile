BIN=./node_modules/.bin
WATCHIFY=$(BIN)/watchify
BROWSERIFY=$(BIN)/browserify

REQUIRE_VENDORS=
EXCLUDE_MODULES=

ENTRY:=treemap.js
OUTPUT=build/bundle.js

build: bundle

clean:
	rm -rf $(OUTPUT)

watch:
	$(WATCHIFY) -d $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

watch-raw:
	$(WATCHIFY) $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

watch-noreload:
	$(WATCHIFY) -d $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

bundle:
	$(BROWSERIFY) -d $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

bundle-raw:
	$(BROWSERIFY) $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

bundle-min:
	$(BROWSERIFY) $(EXCLUDE_MODULES) $(ENTRY) | $(UGLIFYJS) > $(OUTPUT)

vendor:
	$(BROWSERIFY) -d $(REQUIRE_VENDORS) -o build/vendor.js

vendor-raw:
	$(BROWSERIFY) $(REQUIRE_VENDORS) -o build/vendor.js
