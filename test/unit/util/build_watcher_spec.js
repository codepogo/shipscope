describe('BuildWatcher', function() {
  'use strict'
  var watcher, projects

  before(function() {
    chrome = {
      notifications: {
        create: function() {},
        onClicked: { addListener: function() {} },
        onClosed: { addListener: function() {} }
      }
    }
  })

  beforeEach(function() {
    watcher = new BuildWatcher()
  })

  it('ignores any builds that are not testing', function() {
    projects = [ProjectFixtures.good, ProjectFixtures.good2]
    watcher.scan(projects)
    watcher.getWatchList().should.eql({})
  })

  it('remembers builds that are testing', function() {
    projects = [ProjectFixtures.good, ProjectFixtures.testing]
    watcher.scan(projects)
    watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": ProjectFixtures.testing.builds[0]})
  })

  describe('notifications', function() {
    var alertOptions

    beforeEach(function() {
      projects = [ProjectFixtures.good, ProjectFixtures.testing]
      alertOptions = {
        type: "basic",
        title: "shipscope",
        message: 'success',
        priority: 1,
        iconUrl: "img/shipscope_icon48.png"
      }
      projects[1].builds[0].status = 'testing'

      sinon.spy(chrome.notifications, 'create')
    })

    afterEach(function() {
      chrome.notifications.create.restore()
    })

    it('creates a notification when a build succeeds', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": projects[1].builds[0]})

      projects[1].builds[0].status = 'success'
      watcher.scan(projects)

      chrome.notifications.create.calledOnce.should.be.true
    })

    it('creates a notification when a build fails', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": ProjectFixtures.testing.builds[0]})

      projects[1].builds[0].status = 'error'
      watcher.scan(projects)

      chrome.notifications.create.calledWithExactly(null, alertOptions )
      chrome.notifications.create.calledOnce.should.be.true
    })

    it('stops watching a build after the notification has been sent', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": projects[1].builds[0]})

      projects[1].builds[0].status = 'success'
      watcher.scan(projects)
      projects[1].builds[0].status = 'notifying'
      watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": projects[1].builds[0]})
    })

    it('creates a notification when a build is stopped', function() {
      watcher.scan(projects)
      watcher.getWatchList().should.eql({"2f406670-007f-0132-cb2f-5247614ee66f": ProjectFixtures.testing.builds[0]})

      projects[1].builds[0].status = 'stopped'
      watcher.scan(projects)

      chrome.notifications.create.calledWithExactly(null, alertOptions)
      chrome.notifications.create.calledOnce.should.be.true
    })
  })
})
