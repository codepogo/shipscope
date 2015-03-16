describe('Build View', function() {
  'use strict'

  var build, view

  beforeEach(function() {
    build = new Build(BuildFixtures.good[0])
    view = new BuildView({model: build, projectId: 12345})
  })

  it('should set the projectId on the view when initializing', function() {
    view.projectId.should.eql(12345)
  })

  describe('template helpers', function() {
    var helper

    beforeEach(function() {
      helper = view.templateHelpers()
    })

    it('should provide the project id in a template helper', function() {
      view.projectId.should.eql(12345)
    })

    it('should provide the correct status icon for a stopped build', function() {
      build.attributes.status = 'stopped'
      helper.getStatusIcon.bind(build.attributes)().should.equal('warning')
    })

    it('should provide the correct status icon for a successful build', function() {
      helper.getStatusIcon.bind(build.attributes)().should.equal('success')
    })

    it('should provide the correct status icon for a failed build', function() {
      build.attributes.status = 'error'
      helper.getStatusIcon.bind(build.attributes)().should.equal('danger')
    })

    it('should provide the correct status icon for a testing build', function() {
      build.attributes.status = 'testing'
      helper.getStatusIcon.bind(build.attributes)().should.equal('info')
    })
  })
})
