describe('Project', function() {
  'use strict'
  var project

  describe('properties', function() {
    beforeEach(function() {
      project = new Project(ProjectFixtures.good)
    })

    it('should have a li as its tag', function() {
      project.tagName.should.equal('li')
    })

    it('should have the correct repository name', function() {
      project.get('repository_name').should.equal('falafel/chickpea')
    })
  })

  describe('status', function() {
    it('should summarize a good build', function() {
      project = new Project(ProjectFixtures.good)
      var status = project.getStatus()
      status.should.have.property('status', Build.STATES.success)
    })

    it('should summarize a bad build', function() {
      project = new Project(ProjectFixtures.bad)
      var status = project.getStatus()
      status.should.have.property('status', Build.STATES.error)
    })
  })
})
