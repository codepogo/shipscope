describe('Projects', function() {
  'use strict'
  var projects, builds

  beforeEach(function() {
    projects = new Projects([ProjectFixtures.good, ProjectFixtures.good2])
    builds = new Builds(BuildFixtures.error)

    projects.each(function(project) {
      project.set({builds: builds})
    })
  })

  it('should have loaded both projects correctly', function() {
    projects.length.should.equal(2)
  })

  describe('status', function() {
    it('should summarize all projects, including a bad build', function() {
      var status = projects.getSummary()
      status.should.eql({count: 1, state: Build.STATES.error})
    })

    it('should summarize all projects, including only a good build', function() {
      projects = new Projects([ProjectFixtures.good, ProjectFixtures.good2])
      var status = projects.getSummary()
      status.should.eql({count: 2, state: Build.STATES.success})
    })

    it('should summarize all projects, including testing build', function() {
      projects = new Projects([ProjectFixtures.good, ProjectFixtures.testing])
      var status = projects.getSummary()
      status.should.eql({count: 1, state: Build.STATES.testing})
    })
  })
})

