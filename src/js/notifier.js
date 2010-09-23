(function(context, name) {
	var drhac = context[name] = context[name] || {};

  function Notifier (actionIcon) {
    if (!(this instanceof Notifier)) {
      return new Notifier(actionIcon);
    }

    if (!actionIcon) {return;}
    this.icon = actionIcon;
    this.icon.setBadgeBackgroundColor({color:[74,174,102,80]});
    ijl.sub("playbackBegin", this.showSong, this)
      .sub("playerTurnedOff", this.resetDisplay, this)
      .sub("playerTurnedOn", this.activate, this);
  }

  Notifier.prototype = {
    showSong: function(song) {
      if (!song || !song.title || !song.artist) {
        return;
      }
      this.setTitle(song.title + " - " + song.artist);
      this.setBadgeText(song.like ? "♥" : "");
      // fixing icon...seemed we can't set title and icon
      // in two concurrent events.
      this.activate();
    },

    activate: function() {
      this.setIcon("logo_128.png");
    },

    resetDisplay: function() {
      this.setTitle(this.defaultTitle);
      this.setBadgeText(this.defaultBadgeText);
      this.setIcon(this.defaultIcon);
    },

    setIcon: function(path) {
      this.icon.setIcon({
        path: path
      });
    },

    setBadgeText: function(text) {
      this.icon.setBadgeText({
        text: text
      });
    },

    setTitle: function(text) {
      this.icon.setTitle({
        title: text
      });
    },

    defaultIcon: "logo_off.png",
    defaultTitle: "DrhAc",
    defaultBadgeText: ""
  };

  drhac.Notifier = Notifier;
})(this, 'drhac');
