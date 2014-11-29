var Brew = require(__dirname + "/../../lib/resources/Brew"),
  sinon = require("sinon"),
  expect = require("chai").expect

describe("Brew", function() {
  var resource

  beforeEach(function() {
    resource = new Brew()
    resource._brewRepository = {
      findById: sinon.stub(),
      findByName: sinon.stub(),
      findAll: sinon.stub()
    }
  })

  it("Should find brew", function(done) {
    var brewId = "foo"
    var brew = {}
    resource._brewRepository.findById.withArgs(brewId, sinon.match.func).callsArgWith(1, undefined, brew)

    var request = {
      params: {
        brewId: brewId
      }
    }

    resource.retrieve(request, function(error, foundBrew) {
      var findByIdCall = resource._brewRepository.findById.getCall(0)
      expect(findByIdCall.calledWith(brewId, sinon.match.func)).to.be.true
      expect(foundBrew).to.equal(brew)

      done()
    })
  })

  it("Should find all brews", function(done) {
    var error = null
    var brews = []
    resource._brewRepository.findAll.callsArgWith(0, error, brews)

    var request = {
      query: {}
    }

    resource.retrieveAll(request, function(error, brews) {
      var findAllCall = resource._brewRepository.findAll.getCall(0)
      expect(findAllCall.calledWith(sinon.match.func)).to.be.true
      expect(brews).to.be.an('array')

      done()
    })
  })

  it("Should find brews by name", function(done) {
    var error = null
    var brew = {}
    resource._brewRepository.findByName.callsArgWith(1, error, brew)

    var name = "foo"
    var request = {
      query: {
        name: name
      }
    }

    resource.retrieveAll(request, function(error, brew) {
      expect(brew).to.be.ok

      done()
    })
  })
})
