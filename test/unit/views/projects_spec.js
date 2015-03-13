var App = {
  intercom: {
    postMessage: function() {},
    onMessage: {
      addListener: function(callback) {App.callback = callback}
    }
  }
}

describe('Projects View', function() {
  'use strict'

  var should, projects, view

  before(function() {
    should = chai.should()
    sinon.stub(window, 'ga')
  })

  after(function() {
    window.ga.restore()
  })

  beforeEach(function() {
    sinon.stub(window, 'setInterval').returns(12345)
    sinon.stub(window, 'clearInterval')

    projects = new Projects([ProjectFixtures.good, ProjectFixtures.bad])
  })

  afterEach(function() {
    window.setInterval.restore()
    window.clearInterval.restore()
  })

  it('should clean up the timers on destroy if they have been created', function() {
    view = new ProjectsView({collection: projects})
    view.initialPoller = {}
    view.poller = {}

    view.onDestroy()

    window.clearInterval.calledTwice.should.be.true
  })

  it('should not clean up the poller timer on destroy if it has not been created', function() {
    view = new ProjectsView({collection: projects})
    view.onDestroy()
    window.clearInterval.calledOnce.should.be.true
  })

  it('should switch to the slow poller if projects have been fetched already', function() {
    view = new ProjectsView({collection: projects})
    view.initialPoller = {}
    view.switchToSlowPoller([{project: true}])

    should.not.exist(view.initialPoller)
    view.poller.should.equal(12345)
    window.setInterval.calledTwice.should.be.true
    window.clearInterval.calledOnce.should.be.true
  })

  it('should not switch to the slow poller if projects have not been fetched', function() {
    view = new ProjectsView({collection: projects})
    view.switchToSlowPoller()

    view.initialPoller.should.equal(12345)
    should.not.exist(view.poller)
    window.setInterval.calledOnce.should.be.true
    window.clearInterval.called.should.be.false
  })

  describe('initializing', function() {
    beforeEach(function() {
      sinon.stub(App.intercom, 'postMessage')
      sinon.spy(App.intercom.onMessage, 'addListener')

      view = new ProjectsView({collection: projects})
    })

    afterEach(function() {
      App.intercom.postMessage.restore()
      App.intercom.onMessage.addListener.restore()
    })

    it('should fetch projects on initialization', function() {

      App.intercom.postMessage.calledOnce.should.be.true
      App.intercom.postMessage.calledWithExactly({type: 'projects.get'}).should.be.true
      App.intercom.onMessage.addListener.calledOnce.should.be.true
      window.setInterval.calledOnce.should.be.true
    })

    it('ignore messages except projects.set', function() {
      sinon.spy(view, 'switchToSlowPoller')

      App.intercom.onMessage.addListener.calledOnce.should.be.true
      App.callback.should.not.equal(undefined)

      App.callback({type: 'bobloblaw'})

      view.switchToSlowPoller.called.should.be.false
      view.switchToSlowPoller.restore()
    })

    it('should update the view collection when projects are fetched', function() {
      sinon.spy(view, 'switchToSlowPoller')
      sinon.stub(view.collection, 'reset')

      App.intercom.onMessage.addListener.calledOnce.should.be.true
      App.callback.should.not.equal(undefined)

      App.callback({type: 'projects.set', data: {one: 1}})

      view.switchToSlowPoller.calledOnce.should.be.true
      view.collection.reset.calledOnce.should.be.true

      view.switchToSlowPoller.restore()
      view.collection.reset.restore()
    })

  })

  describe('view project', function() {
    it('should trigger project viewing when a project is clicked', function() {
      sinon.stub(Backbone.Events, 'trigger')
      var event = {
        type: 'cilck',
        currentTarget: {
          querySelector: function() {}
        }
      }
      sinon.stub(event.currentTarget, 'querySelector').returns({dataset: {id: 12345}})

      view = new ProjectsView({collection: projects})
      view.onClick(event)

      Backbone.Events.trigger.calledWithExactly('show:project', 12345).should.be.true
      event.currentTarget.querySelector.restore()
    })
  })
})
