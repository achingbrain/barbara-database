var Autowire = require("wantsit").Autowire

BrewTemperature = function() {
  this._brewRepository = Autowire
}

BrewTemperature.prototype.retrieveAll = function(request, reply) {
  this._brewRepository.findByName(request.params.brewId, function(error, brews) {
    if(error || !brews || brews.length == 0) {
      return reply(error).code(404)
    }

    if(!brews[0].temperatures) {
      brews[0].temperatures = []
    }

    reply(brews[0].temperatures)
  }.bind(this))
}

BrewTemperature.prototype.create = function(request, reply) {
  this._brewRepository.findByName(request.params.brewId, function(error, brews) {
    if(error || !brews || brews.length == 0) {
      return reply(error).code(404)
    }

    var celsius = request.payload.celsius
    celsius = parseFloat((celsius).toFixed(4))

    if(!brews[0].temperatures) {
      brews[0].temperatures = []
    }

    brews[0].temperatures.push({
      date: new Date(),
      celsius: celsius
    })

    // persist the new temperature
    this._brewRepository.save(brews[0])

    reply({celsius: celsius})
  }.bind(this))
}

module.exports = BrewTemperature
