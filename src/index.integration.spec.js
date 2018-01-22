'use strict';

/* eslint-disable no-unused-expressions */

const chai = require(`chai`);
const chaiAsPromised = require(`chai-as-promised`);
const fs = require(`fs`);
const index = require(`./index`).deprecator;
const mocha = require(`mocha`);
const nock = require(`nock`);
const sinon = require(`sinon`);
const sinonChai = require(`sinon-chai`);
const tmp = require(`tmp`);

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

const afterEach = mocha.afterEach;
const before = mocha.before;
const beforeEach = mocha.beforeEach;
const describe = mocha.describe;
const it = mocha.it;

describe(`deprecator`, function () {
  // Setting up our fake project takes longer than the default Mocha timeout.
  this.timeout(20000);

  before(() => {
    nock.disableNetConnect();
  });

  beforeEach(function () {
    this.cwd = process.cwd();
    this.tmpDir = tmp.dirSync();
    process.chdir(this.tmpDir.name);

    this.shell = {
      exec: sinon.stub(),
    };

    this.shell.exec.yields(0, ``, ``);

    this.deprecator = index(this.shell);
  });

  afterEach(function () {
    process.chdir(this.cwd);
  });

  describe(`npm manager`, () => {
    beforeEach(function () {
      fs.writeFileSync(`package.json`, `{"name":"deprecator"}`);
    });

    it(`fails when rules aren't provided`, function () {
      return expect(this.deprecator({}))
        .to.be.rejectedWith(Error, `Must provide a 'rules' property as an array in the configuration.`);
    });

    it(`won't deprecate package versions with empty rule list`, function () {
      const scope = setupNpmNock(packageData);

      return expect(this.deprecator({rules: []}))
        .to.be.fulfilled
        .to.to.eventually.deep.equal({})
        .then(() => expect(this.shell.exec).to.not.have.been.called)
        .then(() => scope.done());
    });

    it(`rejects when an invalid rule is provided`, function () {
      const scope = setupNpmNock(packageData);

      return expect(this.deprecator({rules: [`invalid`]}))
        .to.be.rejectedWith(Error, `The following rule is not supported by the 'npm' manager - invalid`)
        .then(() => expect(this.shell.exec).to.not.have.been.called)
        .then(() => scope.done());
    });

    it(`deprecates all versions of the package`, function () {
      const scope = setupNpmNock(packageData);

      return expect(this.deprecator({rules: [`all`]}))
        .to.be.fulfilled
        .and.to.eventually.deep.equal({deprecator: [`2.0.0`, `3.0.0`]})
        .then(() => expect(this.shell.exec).to.have.been.calledTwice)
        .then(() => expect(this.shell.exec.firstCall).calledWith(`npm deprecate deprecator@2.0.0 "This version is no longer supported. Please upgrade."`))
        .then(() => expect(this.shell.exec.secondCall).calledWith(`npm deprecate deprecator@3.0.0 "This version is no longer supported. Please upgrade."`))
        .then(() => scope.done());
    });

    it(`skips deprecating a version if the registry is missing the version's metadata`, function () {
      const scope = setupNpmNock(corruptedPackageData);

      return expect(this.deprecator({rules: [`all`]}))
        .to.be.fulfilled
        .to.to.eventually.deep.equal({deprecator: [`3.0.0`]})
        .then(() => expect(this.shell.exec).to.have.been.calledOnce
          .and.calledWith(`npm deprecate deprecator@3.0.0 "This version is no longer supported. Please upgrade."`))
        .then(() => scope.done());
    });

    it(`rejects when 'npm deprecate' command fails`, function () {
      const scope = setupNpmNock(packageData);
      this.shell.exec.yields(1, ``, `npm failed`);

      return expect(this.deprecator({rules: [`all`]}))
        .to.be.rejectedWith(Error, `Failed to deprecate deprecator@2.0.0 - npm failed`)
        .then(() => expect(this.shell.exec).to.have.been.calledTwice)
        .then(() => expect(this.shell.exec.firstCall).calledWith(`npm deprecate deprecator@2.0.0 "This version is no longer supported. Please upgrade."`))
        .then(() => expect(this.shell.exec.secondCall).calledWith(`npm deprecate deprecator@3.0.0 "This version is no longer supported. Please upgrade."`))
        .then(() => scope.done());
    });

    it(`resolve and does nothing with 'autoDiscover' enabled`, function () {
      return expect(this.deprecator({autoDiscover: true, rules: [`all`]}))
        .to.be.fulfilled
        .then(() => expect(this.shell.exec).to.not.have.been.called);
    });
  });
});

function setupNpmNock(packageData) {
  return nock(`https://registry.npmjs.org`)
    .get(`/deprecator`)
    .reply(200, JSON.stringify(packageData()));
}

function packageData() {
  return {
    name: `deprecator`,
    versions: {
      '1.0.0': {
        deprecated: `This version has been deprecated`,
        name: `deprecator`,
        version: `1.0.0`,
      },
      '2.0.0': {
        name: `deprecator`,
        version: `2.0.0`,
      },
      '3.0.0': {
        name: `deprecator`,
        version: `3.0.0`,
      },
    },
    time: {
      modified: `2018-01-29T18:00:00.000Z`,
      created: `2018-01-28T18:00:00.000Z`,
      '1.0.0': `2018-01-28T18:00:00.000Z`,
      '2.0.0': `2018-01-29T18:00:00.000Z`,
      '3.0.0': `2018-01-30T18:00:00.000Z`,
    },
  };
}

function corruptedPackageData() {
  const corruptedPackageData = packageData();

  delete corruptedPackageData.versions[`2.0.0`];

  return corruptedPackageData;
}

