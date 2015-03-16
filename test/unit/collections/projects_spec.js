describe('Projects', function() {
  'use strict'
  var projects, builds

  beforeEach(function() {
    var project1 = new Project(ProjectFixtures.good),
        project2 = new Project(ProjectFixtures.good2),
        goodBuilds = new Builds(BuildFixtures.good),
        badBuilds = new Builds(BuildFixtures.error)

    project1.set({builds: goodBuilds})
    project2.set({builds: badBuilds})
    projects = new Projects([project1, project2])
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

    it('should summarize all projects', function() {
      // projects = new Projects([ProjectFixtures.good, ProjectFixtures.testing])
      var status = projects.getSummary()
      status.should.eql({count: 1, state: Build.STATES.error})
    })
  })
})

