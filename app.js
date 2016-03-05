(function() {

  return {
    // defaultState: 'home',

    resources: {
      USERNAME: 'jeff',
      PASSWORD: 'password',
      TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyMCwiZW1haWwiOiJqZWZmLnJvY2hlQGJyaWdodHJlcHMuY29tIiwiZXhwIjoxNDU3MjI2Mjc5LCJ1c2VybmFtZSI6ImplZmYifQ.2WJJPM6bbUYHzpZoW1Q7hgCKTScLCJo-SsG756ys8kM',
      API_URL: 'http://frozen-hollows-2684.herokuapp.com/api',
    },

    events: {
      'app.activated': 'init',
      'userGetRequest.done': 'this.showInfo',
      'userGetRequest.fail': 'this.showError',
      'click #add-btn': 'sendToBrightReps',
      'fetchConnection.done': 'showConnectionDetails',
      'fetchConnection.fail': 'showButton',
      'postConnection.done': 'showConnectionDetails',
      'postConnection.fail': 'showError'
    },

    requests: {
      userGetRequest: function(id) {
        return {
          url: '/api/v2/users/' + id + '.json',
          type:'GET',
          dataType: 'json'
        };
      },

      postConnection: function(ticket) {
        // https://support.zendesk.com/hc/en-us/articles/203903346
        return {
          url: helpers.fmt('%@/connections/', this.api_root),
          headers: {"Authorization": helpers.fmt("JWT %@", this.token)},
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(ticket)
        };
      },

      fetchConnection: function(ticket) {
        // TODO: if doesn't exist, fine, if other error, return the error
        return {
          url: helpers.fmt('%@/connections/zendesk/%@/', this.api_root, ticket.id),
          headers: {"Authorization": helpers.fmt("JWT %@", this.token)},
          type: 'GET',
          contentType: 'application/json'
        };
      }
    },

    init: function() {
      this.username = this.setting('username') || this.resources.USERNAME;
      this.password = this.setting('password') || this.resources.PASSWORD;
      this.token = this.setting('token') || this.resources.TOKEN;
      this.api_root = this.setting('br_api_url') || this.resources.API_URL;
      // Check if it's already a ticket
      this.getConnection();
      this.switchTo('loading');
      // If not, render button page
      // If it is, render connection details page
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
      console.log("SENT", id, " TO BRIGHTREPS");
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
