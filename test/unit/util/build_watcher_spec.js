describe('BuildWatcher', function() {
  'use strict'
  var watcher, projects, buildsCollection, projectsCollection, project1, project2

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
    buildsCollection = new Builds(BuildFixtures.good)
    projectsCollection = new Projects([ProjectFixtures.good, ProjectFixtures.good2])

    projectsCollection.each(function(project) {
      project.set({builds: buildsCollection})
    })

    watcher.scan(projectsCollection)
    watcher.getWatchList().should.eql({})
  })

  it('remembers builds that are testing', function() {
    var builds1 = new Builds(BuildFixtures.testing),
        builds2 = new Builds(BuildFixtures.error),
        project1 = new Project({builds: builds1}),
        project2 = new Project({builds: builds2}),
        projectsCollection = new Projects([project1, project2])

    project1.set({builds: builds1})
    project2.set({builds: builds2})

    watcher.scan(projectsCollection)
    watcher.getWatchList().should.include.keys("2f406670-007f-0132-cb2f-5247614ee66f")
  })

  describe('notifications', function() {
    var alertOptions

    beforeEach(function() {
      buildsCollection = new Builds(BuildFixtures.testing)
      project1 = new Project(ProjectFixtures.good).set({builds: buildsCollection})
      project2 = new Project(ProjectFixtures.good2).set({builds: buildsCollection})
      projectsCollection = new Projects([project1, project2])

      projectsCollection.each(function(project) {
        project.set({builds: buildsCollection})
      })

      alertOptions = {
        type: "basic",
        title: "shipscope",
        message: 'success',
        priority: 1,
        iconUrl: "img/shipscope_icon_stopped_128.png"
      }

      sinon.spy(chrome.notifications, 'create')
    })

    afterEach(function() {
      chrome.notifications.create.restore()
    })

    it('creates a notification when a build succeeds', function() {
      watcher.scan(projectsCollection)

      projectsCollection.at(1).get('builds').at(0).set({status: 'success'})
      watcher.scan(projectsCollection)

      chrome.notifications.create.calledOnce.should.be.true
    })

    it('creates a notification when a build fails', function() {
      watcher.scan(projectsCollection)
      projectsCollection.at(1).get('builds').at(0).set({status: 'error'})

      watcher.scan(projectsCollection)
      chrome.notifications.create.calledWith(null, alertOptions)
      chrome.notifications.create.calledOnce.should.be.true
    })

    it('stops watching a build after the notification has been sent', function() {
      watcher.scan(projectsCollection)

      projectsCollection.at(1).get('builds').at(0).set({status: 'success'})
      watcher.scan(projectsCollection)
      projectsCollection.at(1).get('builds').at(0).set({status: 'notifying'})
      watcher.getWatchList().should.include.keys("2f406670-007f-0132-cb2f-5247614ee66f")
    })

    it('creates a notification when a build is stopped', function() {
      var uuid = BuildFixtures.testing[0].uuid,
          watchList,
          call,
          testingBuild = projectsCollection.at(1).get('builds').at(0)

      watcher.scan(projectsCollection)
      watchList = watcher.getWatchList()
      watchList[uuid].should.not.be.null

      testingBuild.attributes.status = 'stopped'
      watcher.scan(projectsCollection)

      chrome.notifications.create.calledOnce.should.be.true
      uuid.should.eql(chrome.notifications.create.args[0][0])

    })
  })
})
