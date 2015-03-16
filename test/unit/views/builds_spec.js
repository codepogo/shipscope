var ga = function() {}
describe('Build View', function() {
  'use strict'

  var project, builds, view

  beforeEach(function() {
    project = new Project(ProjectFixtures.good)
    builds = new Builds(BuildFixtures.good)
    project.set({builds: builds})
    view = new BuildsView({collection: builds}, {projectId: project.id})
  })

  it('should have a collection when it is instantiated', function() {
    view.projectId.should.equal(project.id)
  })

  it('should provide the project id to its child views', function() {
    view.childViewOptions().projectId.should.equal(project.id)
  })

  describe('restarting a build', function() {
    var event
    beforeEach(function() {
      event = {
        type: 'click',
        currentTarget: {
          dataset: {
            id: project.attributes.builds.at(0).id
          }
        },
        preventDefault: function() {}
      }
    })

    afterEach(function() {
      window.ga.restore()
    })

    it('should allow the user to restart the build', function() {
      var build = builds.at(0)

      sinon.stub(window, 'ga')
      sinon.stub(build, 'restart')
      view.onClick(event)

      window.ga.calledOnce.should.be.true
      build.restart.calledOnce.should.be.true
    })

    it('should not try to restart a nonexistent build', function() {
      event.currentTarget.dataset.id = 99999999999
      sinon.stub(window, 'ga')
      sinon.stub(console, 'warn')
      view.onClick(event)

      window.ga.called.should.be.false
      console.warn.calledOnce.should.be.true
    })
  })
})
