var App = {
  options: {api_key: '9876543210'}
}
describe('Build', function() {
  'use strict'

  var build

  beforeEach(function() {
    build = new Build()
  })

  it('should have an li tagName', function() {
    var build = new Build();
    build.tagName.should.equal('li')
  })

  describe('status', function() {
    it('should return the latest status of the build as a number', function() {
      build.set({status: 'stopped'})
      build.getStatus().should.equal(0)

      build.set({status: 'success'})
      build.getStatus().should.equal(1)

      build.set({status: 'error'})
      build.getStatus().should.equal(2)

      build.set({status: 'testing'})
      build.getStatus().should.equal(3)
    })
  })

  describe('restarting', function() {
    var deferred

    beforeEach(function() {
      deferred = $.Deferred()
      sinon.stub($, 'post').returns(deferred.promise())
      build = new Build({id: 123, status: 'error'});
    })

    it('should set the status to testing when restarting a build', function(done) {
      build.restart()
      deferred.resolve()

      build.get('status').should.equal('testing')
      done()
    })

    it('should report an error when restarting a build fails', function(done) {
      sinon.stub(console, 'error')
      build.restart()
      deferred.reject()

      console.error.calledOnce.should.equal(true)
      done()
      console.error.restore()
    })

    afterEach(function() {
      $.post.restore()
    })
  })
})
