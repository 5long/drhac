(function(context, name) {
	var drhac = context[name] = context[name] || {};
  
  drhac.config = {
      ls: localStorage
    , use: function(ls) {
      this.ls = ls || localStorage;
    }
    , set: function(name, value) {
      this.ls[name]=JSON.stringify(value);
    }
    , get: function(name) {
      try {
        return JSON.parse(this.ls[name]);
      } catch(e) {
        return null;
      }
    }
  }
})(this, 'drhac');

