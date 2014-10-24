var ga = function() {}
describe('Project View', function() {
  'use strict'

  var project, view
  beforeEach(function() {
    project = new Project(ProjectFixtures.good)
    view = new ProjectView({model: project})
  })

  describe('template helpers', function() {
    it('should provide the project status for a successful build', function() {
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('success')
    })
    it('should provide the project status for a successful build', function() {
      project.attributes.builds[0].status = 'stopped'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('success')
    })

    it('should provide the project status for a successful build', function() {
      project.attributes.builds[0].status = 'error'
      project.attributes.builds[0].branch = 'master'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('danger')
    })

    it('should provide the project status for a successful build', function() {
      project.attributes.builds[0].status = 'testing'
      project.attributes.builds[0].branch = 'master'
      var p = view.serializeData()
      var status = view.templateHelpers.getStatus.bind(p)()

      status.should.equal('info')
    })
  })
})

