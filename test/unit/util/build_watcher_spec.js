describe('BuildWatcher', function() {
  'use strict'
  var watcher, projects

  beforeEach(function() {
    watcher = new BuildWatcher()
  })

  it('should ignore any builds that are not testing', function() {
    projects = [ProjectFixtures.good, ProjectFixtures.good2]
    watcher.scan(projects)
    watcher.getWatchList().should.eql({})
  })

  it('should remember builds that are testing', function() {
    projects = [ProjectFixtures.good, ProjectFixtures.testing]
    watcher.scan(projects)
    watcher.getWatchList().should.eql({'3000001': true})
  })

  describe('notifications', function() {
    var alertOptions

    before(function() {
      chrome = {notifications: {create: function() {}}}
    })

    beforeEach(function() {
      projects = [ProjectFixtures.good, ProjectFixtures.testing]
      alertOptions = {
        type: "basic",
        title: "shipscope",
        message: 'success',
        priority: 1,
        iconUrl: "img/shipscope_icon48.png"
      }

      sinon.spy(chrome.notifications, 'create')
    })

    afterEach(function() {
      projects[1].builds[0].status = 'testing'
      chrome.notifications.create.restore()
    })

    it('should create a notification when a build succeeds', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({'3000001': true})

      projects[1].builds[0].status = 'success'
      watcher.scan(projects)

      chrome.notifications.create.calledOnce.should.be.true
    })

    it('should create a notification when a build fails', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({'3000001': true})

      projects[1].builds[0].status = 'error'
      watcher.scan(projects)

      chrome.notifications.create.calledWithExactly(null, alertOptions )
      chrome.notifications.create.calledOnce.should.be.true
    })

    it('should stop watching a build after the notification has been sent', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({'3000001': true})

      projects[1].builds[0].status = 'success'
      watcher.scan(projects)
      watcher.getWatchList().should.eql({})
    })

    it('should create a notification when a build is stopped', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({'3000001': true})

      projects[1].builds[0].status = 'stopped'
      watcher.scan(projects)

      chrome.notifications.create.calledWithExactly(null, alertOptions)
      chrome.notifications.create.calledOnce.should.be.true
    })
  })
})
