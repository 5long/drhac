(function(context, name) {
	var drhac = context[name] = context[name] || {};

  function Player (node, autoplay) {
    // Bye, keyword 'new'.
    if (!(this instanceof Player)) {return new Player(node, autoplay);}
		// Should be an HTML5 audio node.
		node.autoplay = true;
		this.node = node;
    this.playlist = [];
    this.playing = false;
    autoplay = typeof autoplay == "boolean"
      ? autoplay
      : this.loadStatus();
    if (autoplay) {
      this.turnOn();
    }

    ijl.sub('playlistLoad', function(list) {
      var starving = !this.playlist.length;
      this.append(list);
      if (this.playing && starving) {
        this.playNext();
      }
    }, this);

    this.on('ended', ijl.bind(this, this.onEnded))
      .on('error', ijl.bind(this, this.onError));
	}

	Player.prototype = {

    // Wrap the audio node method.
		play: function(url) {
      var node = this.node;
      node.src=url;
      node.load();
      node.play();
			return this;
		},

    append: function(list) {
      this.playlist = this.playlist.concat(list);
      return this;
    },

    saveStatus: function() {
      drhac.config.set("playerStatus", this.playing);
    },

    loadStatus: function() {
      return !!drhac.config.get("playerStatus");
    },

    turnOn: function() {
      this.playing = true;
      this.saveStatus();
      ijl.pub("playerTurnedOn", null, this);
      this.playNext();
    },

    turnOff: function() {
      this.playing = false;
      this.node.pause();
      this.saveStatus();
      ijl.pub("playerTurnedOff", null, this);
    },

    toggle: function() {
      if (this.playing) {
        this.turnOff();
      } else {
        this.turnOn();
      }
    },

    skipCurrent: function() {
      if (!this.playing) {return;}
      ijl.pub("playbackSkipped", this.curSong, this);
      this.playNext();
    },

    playNext: function() {
      this.curSong = this.playlist.shift();
      if (this.playlist.length < 3) {
        ijl.pub('playlistRunningOut', this.curSong, this);
      }
      if (!this.curSong) {return this;}
      var url = this.curSong.url;
      ijl.pub('playbackBegin', this.curSong, this);
      this.play(url);
      return this;
    },

    // Implement my own node wrapper?
    // Or just use YUI instead?
    on: function(type, fn) {
      this.node.addEventListener(type, fn, false);
      return this;
    },

    onEnded: function() {
      ijl.pub('playbackEnded', this.curSong, this);
      if (this.playing) {
        this.playNext();
      }
    },

    onError: function() {
      if (this.playing) {
        this.playNext();
      }
    }

	};

	drhac.Player = Player;
})(this, 'drhac');

