var OptionsModel = Backbone.Model.extend({
  defaults: {
    api_key: ''
  },

  isEmptyApiKey: function() {
    var api_key = this.attributes.api_key
    return api_key != null && api_key.trim() == ''
  },

  set: function(attrs, options) {
    Backbone.Model.prototype.set.apply(this, arguments);

    if (attrs.api_key && (!options || !options.quiet)) {
      chrome.storage.sync.set(attrs);
    }
  },
});
