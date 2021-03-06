# deprecator

[![CircleCI](https://circleci.com/gh/factset/deprecator.svg?style=svg)](https://circleci.com/gh/factset/deprecator)
[![codecov](https://codecov.io/gh/factset/deprecator/branch/master/graph/badge.svg)](https://codecov.io/gh/factset/deprecator)

> Deprecate npm package versions based on rule matching.

`deprecator` is a tool that allows you to deprecate one or more versions of a package published to an [`npm`](https://npmjs.com)-compatible registry.

Versions of a package are selected for deprecation based on matching each version against one or more rules.

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Available Rules](#available-rules)
    - [`all`](#all)
- [Debugging](#debugging)
- [Node Support Policy](#node-support-policy)
- [Contributing](#contributing)
- [Copyright](#copyright)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

* [&#x2713;] [`npm`](https://npmjs.com)-compatible registry support.
  * [&#x2713;] Multiple version deprecation support.
  * [&#x2713;] Mono repositories.

## Installation

To install the `deprecator` tool globally please run the following command:

```bash
yarn global add deprecator
```

If you are using the `npm` package manager you can run the following command:

```bash
npm install --global deprecator
```

Installing `deprecator` globally allows you to the tool to manage the deprecation of multiple packages, and in the future, allow you to use `deprecator` on non-npm packages.

## Usage

Please make sure you have ownership over the package you plan on using with `deprecator`, and that your credentials are stored in your `~/.npmrc` file.

You can log into an [`npm`](https://npmjs.com)-compatible registry using the [`adduser` command](https://docs.npmjs.com/cli/adduser).

Next call `deprecator` from within your project's top folder, passing a comma-separated list of rule names:

```bash
deprecator --rules=[RULE,...]
```

### Available Rules

Whether a rule is available is dependent on which registry a package is published.

At this time we only support [`npm`](https://npmjs.com)-compatible registries.

#### `all`

Deprecate all versions of a package.

```bash
deprecator --rules=all
```

## Debugging

To assist users of `deprecator` with debugging the behavior of this module we use the [debug](https://www.npmjs.com/package/debug) utility package to print information about the release process to the console. To enable debug message printing, the environment variable `DEBUG`, which is the variable used by the `debug` package, must be set to a value configured by the package containing the debug messages to be printed.

To print debug messages on a unix system set the environment variable `DEBUG` with the name of this package prior to executing `deprecator`:

```bash
DEBUG=deprecator deprecator
```

On the Windows command line you may do:

```bash
set DEBUG=deprecator
deprecator
```

## Node Support Policy

We only support [Long-Term Support](https://github.com/nodejs/LTS) versions of Node.

We specifically limit our support to LTS versions of Node, not because this package won't work on other versions, but because we have a limited amount of time, and supporting LTS offers the greatest return on that investment.

It's possible this package will work correctly on newer versions of Node. It may even be possible to use this package on older versions of Node, though that's more unlikely as we'll make every effort to take advantage of features available in the oldest LTS version we support.

As each Node LTS version reaches its end-of-life we will remove that version from the `node` `engines` property of our package's `package.json` file. Removing a Node version is considered a breaking change and will entail the publishing of a new major version of this package. We will not accept any requests to support an end-of-life version of Node. Any merge requests or issues supporting an end-of-life version of Node will be closed.

We will accept code that allows this package to run on newer, non-LTS, versions of Node. Furthermore, we will attempt to ensure our own changes work on the latest version of Node. To help in that commitment, our continuous integration setup runs against all LTS versions of Node in addition the most recent Node release; called _current_.

JavaScript package managers should allow you to install this package with any version of Node, with, at most, a warning if your version of Node does not fall within the range specified by our `node` `engines` property. If you encounter issues installing this package, please report the issue to your package manager.

## Contributing

Please read our [contributing guide](https://github.com/factset/deprecator/blob/master/CONTRIBUTING.md) to see how you may contribute to this project.

## Copyright

Copyright 2018 FactSet Research Systems Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
