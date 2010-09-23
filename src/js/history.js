(function(context, name) {
  var drhac = context[name] = context[name] || {};

  function History (limit, initial) {
    if (!(this instanceof History)) {
      return new History(limit, initial);
    }

    limit = ~~+limit;
    initial = ijl.isArray(initial) ? initial : [];

    this.limit = limit > 0 ? limit : 20 ;
    this.list= initial.slice(-this.limit);
  }

  History.prototype = {
    append: function(type, song) {
      if (!this.typeDict[type]) {
        return;
      }
      this.list.push({
        type: this.typeDict[type],
        id: song.sid
      });
      if (this.list.length > this.limit) {
        this.list.shift();
      }
    },

    typeDict: {
      "playbackEnded": "p",
      "playbackSkipped": "s"
    },

    toString: function() {
      return this.list.map(function(item) {
        return item.id + ":" + item.type;
      }).join("|");
    }
  };

  drhac.History = History;
})(this, "drhac");
