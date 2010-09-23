(function(context, name) {
	var drhac = context[name] = context[name] || {};

  function BeanFm(uid, url, reportFmt) {
    if (!(this instanceof BeanFm)) {
      return new BeanFm(uid, url, reportFmt);
    }

    this.url = url || this.url;
    this.history = drhac.History();
    this.prepareReport = reportFmt || drhac.reportFmt;
    uid = parseInt(uid, 10);

    // Well, user ID shouldn't be 0, right?
    if (uid) {
      this.init(uid);
    } else {
      // Got to find uid from the tag soup.
      var that = this;
      this.findUid(function(uidFound) {
        //@TODO: What about uidFound == 0?
        that.init(uidFound);
      });
    }
  }

  BeanFm.prototype = {
    rUid: /uid\s*(?:[=:])\s*(['"])?(\d+)\1/,
    url: 'http://douban.fm/j/mine/playlist',
    initialized: false,

    extractUid: function(string) {
      return this.rUid.exec(string) && RegExp.$2;
    },

    findUid: function(callback, url) {
      url = url || 'http://douban.fm/radio';
      var that = this;
      ijl.get(url)(function() {
        callback(that.extractUid(this.responseText));
      });
    },

    init: function(uid) {
      this.uid = uid;
      this.initialized = true;
      "playerTurnedOn playbackEnded playlistRunningOut playbackSkipped".split(" ")
        .forEach(function(type) {
        ijl.sub(type, ijl.bind(this, this.report, type));
      }, this);
      //@TODO: make this cleaner?
      this.report('playerTurnedOn');
    },

    report: function(type, song, player) {
      this.history.append(type, song);
      var data = this.prepareReport[type](song, player, this.history);
      this.conn(data);
    },

    // Encapsulate all nitty gritty stuff here.
    conn: function(data) {
      if (!data || !data.type || !this.initialized) {
        return this;
      }
      var dataLoaded = ijl.merge({uid:this.uid}, data);
      ijl.get(this.url, dataLoaded)(function() {
        try {
          var response = JSON.parse(this.responseText);
        } catch (e) {
          // No I won't even try to fix it.
          return;
        }
        // Flash handles numeric string as number?
        if (ijl.isArray(response.song)) {
          response.song.forEach(function(s) {s.like = +s.like;});
          ijl.pub('playlistLoad', response.song);
        }

      });
      return this;
    }
  };

  drhac.BeanFm = BeanFm;
})(this, 'drhac');

