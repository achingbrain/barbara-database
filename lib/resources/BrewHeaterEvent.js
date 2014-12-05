var Autowire = require("wantsit").Autowire

BrewHeaterEvent = function() {
  this._brewRepository = Autowire
}

BrewHeaterEvent.prototype.retrieveAll = function(request, reply) {
  this._brewRepository.findByName(request.params.brewId, function(error, brews) {
    if(error || !brews || brews.length == 0) {
      return reply(error).code(404)
    }

    if(!brews[0].heaterEvents) {
      brews[0].heaterEvents = []
    }

    reply(undefined, brews[0].heaterEvents)
  }.bind(this))
}

BrewHeaterEvent.prototype.create = function(request, reply) {
  this._brewRepository.findByName(request.params.brewId, function(error, brews) {
    if(error || !brews || brews.length == 0) {
      return reply(error).code(404)
    }

    var event = "" + request.payload.event
    event = event.toUpperCase() == "ON" ? "ON" : "OFF"

    if(!brews[0].heaterEvents) {
      brews[0].heaterEvents = []
    }

    brews[0].heaterEvents.push({
      date: new Date(),
      event: event
    })

    // persist the new temperature
    this._brewRepository.save(brews[0])

    reply(undefined, {event: event})
  }.bind(this))
}

module.exports = BrewHeaterEvent
