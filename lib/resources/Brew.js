var Autowire = require("wantsit").Autowire

Brew = function() {
  this._brewRepository = Autowire
}

Brew.prototype.retrieve = function(request, reply) {
  this._brewRepository.findByName(request.params.brewId, function(error, brews) {
    if(!brews || brews.length == 0) {
      return reply(null).code(404)
    }

    reply(null, brews[0])
  })
}

Brew.prototype.retrieveAll = function(request, reply) {
  this._brewRepository.findAll(reply)
}

module.exports = Brew
