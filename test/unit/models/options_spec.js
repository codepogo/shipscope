describe('Options', function() {
  'use strict'
  var options

  beforeEach(function() {
    options = new OptionsModel()
  })

  it('should have an empty default api_key', function() {
    options.get('api_key').should.equal('')
  })

  it('should indicate an empty api key', function() {
    options.isEmptyApiKey().should.equal(true)
  })

  it('should not set the api key if the quiet option is passed', function() {
    chrome.storage = {
      sync: {
        set: function() {}
      }
    }
    sinon.stub(chrome.storage.sync, 'set')
    options.set({api_key: 'not a real api key'}, {quiet: false})

    chrome.storage.sync.set.called.should.be.true
  })
})
