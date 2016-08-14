'use strict'

var Mock = require('mock-require')
var Seneca = require('seneca')
var expect = require('chai').expect
var Lab = require('lab')
var lab = exports.lab = Lab.script()

var logLevels = {debug: 0, info: 1, warn: 2, error: 3, fatal: 4}
var senecaConfigNoLevels = {legacy: {logging: false}, logentriesConfiguration: {}}
var senecaConfig = {legacy: {logging: false}, logentriesConfiguration: {levels: {}}}


lab.test('Overrides levels if not present', (done) => {
  Mock('le_node', function (config) {
    expect(config.levels).to.deep.equal(logLevels)
    return {debug: function () {}}
  })
  Mock.reRequire('../logentries')

  Seneca(senecaConfigNoLevels).use(require('../logentries'))
  done()
})

lab.test('Keeps the levels if they are passed on the config', (done) => {
  Mock('le_node', function (config) {
    expect(config.levels).to.deep.equal({})
    return {debug: function () {}}
  })
  Mock.reRequire('../logentries')

  Seneca(senecaConfig).use(require('../logentries'))
  done()
})

for (var logLevel in logLevels) {
  lab.test('should be able to log at the overriden level ' + logLevel, (done) => {
    Mock('le_node', function (config) {
      var logger = {}
      logger['debug'] = function () {}
      logger[logLevel] = function () {
        done()
      }
      return logger
    })
    Mock.reRequire('../logentries')

    var seneca = Seneca(senecaConfigNoLevels).use(require('../logentries'))
    seneca.log[logLevel]('test')
  })
}
