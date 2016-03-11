(function() {

  return {
    // defaultState: 'home',

    resources: {
      API_URL: 'http://frozen-hollows-2684.herokuapp.com/api',
    },

    events: {
      'app.activated': 'init',
      'checkToken.done': 'getConnection',
      'checkToken.fail': 'loginScreen',
      'click #login-submit': 'handleLogin',
      'getToken.done': 'saveToken',
      'getToken.fail': 'login',
      'click #add-btn': 'sendToBrightReps',
      'fetchConnection.done': 'showConnectionDetails',
      'fetchConnection.fail': 'showButton',
      'postConnection.done': 'showConnectionDetails',
      'postConnection.fail': 'showError'
    },

    requests: {
      postConnection: function(ticket) {
        // https://support.zendesk.com/hc/en-us/articles/203903346
        return {
          url: helpers.fmt('%@/connections/', this.api_root),
          headers: {"Authorization": helpers.fmt("JWT %@", this.store('brtoken'))},
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(ticket)
        };
      },

      fetchConnection: function(ticket) {
        // TODO: if doesn't exist, fine, if other error, return the error
        return {
          url: helpers.fmt('%@/connections/zendesk/%@/', this.api_root, ticket.id),
          headers: {"Authorization": helpers.fmt("JWT %@", this.store('brtoken'))},
          type: 'GET',
          contentType: 'application/json'
        };
      },

      getToken: function(login) {
        return {
          url: helpers.fmt('%@/auth/token/', this.api_root),
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(login)
        };
      },

      checkToken: function(data) {
        return {
          url: helpers.fmt('%@/auth/token-verify/', this.api_root),
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data)
        };
      }
    },

    init: function() {
      this.api_root = this.setting('br_api_url') || this.resources.API_URL;
      // Check if the token's valid, otherwise login
      this.isTokenValid();
      this.switchTo('loading');
    },

    isTokenValid: function() {
      var token = this.store('brtoken');
      this.ajax('checkToken', {token: token});
    },

    loginScreen: function() {
      this.switchTo('login');
    },

    handleLogin: function(event) {
      event.preventDefault();
      var loginData = {
        username: this.$('#username')[0].value,
        password: this.$('#password')[0].value
      };
      this.ajax('getToken', loginData);
    },

    saveToken: function(data) {
      // Save token and check connection
      this.store('brtoken', data.token);
      console.log("TOKEN", data.token);
      this.getConnection();
    },

    getConnection: function() {
      var id = this.ticket().id();
      this.ajax('fetchConnection', {id: id});
    },

    showButton: function() {
      this.switchTo('button');
    },

    showConnectionDetails: function(data) {
      this.switchTo('connection-details', {connection: data});
    },

    showError: function() {
      this.switchTo('error');
    },

    showBrightRepsButton: function() {
      this.switchTo('button');
    },

    sendToBrightReps: function() {
      var id = this.ticket().id();
      var ticketData = {
        zendesk_ticket_id: id,
        name: "Jeff",
        phone_number: '555-555-5555',
        contact_method: "Phone"
      };
      this.ajax('postConnection', ticketData);
      this.switchTo('loading');
      this.switchTo('connection-status');
    },

    notifyConnectionSuccess: function() {
      services.notify('Successfully created a new connection.');
    },

    notifyConnectionFail: function() {
      services.notify('Problem with the POST connection request.', 'error');
    }

  };

}());
