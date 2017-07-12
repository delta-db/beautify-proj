# beautify-proj [![Build Status](https://travis-ci.org/delta-db/beautify-proj.svg)](https://travis-ci.org/delta-db/beautify-proj) [![Coverage Status](https://coveralls.io/repos/delta-db/beautify-proj/badge.svg?branch=master&service=github)](https://coveralls.io/github/delta-db/beautify-proj?branch=master) [![Dependency Status](https://david-dm.org/delta-db/beautify-proj.svg)](https://david-dm.org/delta-db/beautify-proj) [![Code Climate](https://codeclimate.com/github/delta-db/beautify-proj/badges/gpa.svg)](https://codeclimate.com/github/delta-db/beautify-proj) [![Issue Count](https://codeclimate.com/github/delta-db/beautify-proj/badges/issue_count.svg)](https://codeclimate.com/github/delta-db/beautify-proj)

[![Greenkeeper badge](https://badges.greenkeeper.io/delta-db/beautify-proj.svg)](https://greenkeeper.io/)

Uses js-beautify to beautify an entire directory, including its subdirectories.

Usage
---
    beautify-proj -i dir [ -o dir ] -c js-beautify-config-file [ -e reg-ex ]

See [js-beautify](https://github.com/beautify-web/js-beautify) for JSON config file options.


Examples
---

Beautify `./scripts` in place:

    beautify-proj -i scripts -o . -c beautify.json

Beautify `./scripts` in place and ignore `*keep-ugly*`

    beautify-proj -i scripts -o . -c beautify.json -e keep-ugly

Beautify `./scripts` and place beautified files in `/tmp/scripts`:

    beautify-proj -i scripts -o /tmp -c beautify.json

Test for any ugly files (non-beautified) in `scripts`:

    beautify-proj -i scripts -c beautify.json
