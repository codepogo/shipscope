var ga = function() {}
describe('Project View', function() {
  'use strict'

  var project, view
  beforeEach(function() {
    project = new Project(ProjectFixtures.good)
    project.set({builds: new Builds(BuildFixtures.good)})
    view = new ProjectView({model: project})
  })

  describe('template helpers', function() {
    it('should provide the project status for a successful build', function() {
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('success')
    })

    it('should provide the project status for a successful build', function() {
      project.attributes.builds.at(0).attributes.status = 'stopped'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('success')
    })

    it('should provide the project status for a successful build', function() {
      project.attributes.builds.at(0).attributes.status = 'error'
      project.attributes.builds.at(0).attributes.branch = 'master'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('danger')
    })

    it('should provide the project status for a successful build', function() {
      project.attributes.builds.at(0).attributes.status = 'testing'
      project.attributes.builds.at(0).attributes.branch = 'master'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('info')
    })
  })
})

