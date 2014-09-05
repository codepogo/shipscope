// var App = {
//   intercom: {
//     postMessage: function() {},
//     onMessage: {
//       addListener: function(callback) {App.callback = callback}
//     }
//   }
// }

describe('Main View', function() {
  var view

  beforeEach(function() {
    // sinon.spy(Backbone.Events, 'on')
    // sinon.spy(Backbone.Events, 'off')

    // sinon.spy(App.intercom, 'postMessage')

    view = new MainLayout()
  })

  describe('initialization', function() {
    xit('listen for Backbone navigation events', function() {
      Backbone.Events.on.calledWith('show:project').should.be.true
      Backbone.Events.on.calledWith('show:home').should.be.true
    })

    xit('should post messages to the background process', function() {
      App.intercom.postMessage.calledWith({type: 'options.get'}).should.be.true

    })
  })
})
