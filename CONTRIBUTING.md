Contributing
====

Beginning Work on an Issue
---
	Create branch
	git clone branch-url


Committing Changes
---
[Commit Message Format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit)

	npm run coverage
	npm run beautify
	git add -A
	git commit -m msg
	git push


Updating Dependencies
---
This requires having david installed globally, which is already handled by our vagrant setup.

	david update


Publishing to npm
---

	tin -v VERSION
	git add -A
	git commit -m 'VERSION'
	git tag vVERSION
	git push origin master --tags
	npm publish


Run single test
---

	node_modules/mocha/bin/mocha -g regex test


Run subset of tests and analyze coverage
---

	node_modules/istanbul/lib/cli.js cover _mocha -- -g regex test


Debugging Tests Using Node Inspector
---

    $ node-inspector # leave this running in this window
    Use *Chrome* to visit http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858
    $ mocha -g regex test/index.js --debug-brk
