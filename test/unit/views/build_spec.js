describe('Build View', function() {
  'use strict'

  var build, view

  beforeEach(function() {
    // var parent = document.createElement('div')
    // parent.id = 'build_item'
    // document.body.appendChild(parent)
    // console.debug(document.body)
    //

    build = new Build(ProjectFixtures.good.builds[0])
    view = new BuildView({model: build, projectId: 12345})
    // view.render()
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

  // it('should render when the status of a build changes', function() {
  //   sinon.stub(view, 'onStatusChange')
  //   build.set({status: 'testing'})
  //
  //   view.onStatusChange.calledOnce.should.be.true
  // })
})
