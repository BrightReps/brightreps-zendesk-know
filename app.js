(function() {

  return {
    events: {
      'app.activated': 'showBrightRepsButton',
      'userGetRequest.done': 'this.showInfo',
      'userGetRequest.fail': 'this.showError',
      'click #add-btn': 'sendToBrightReps',
      'newBrightRepsConnection.done': 'notifyConnectionSuccess',
      'newBrightRepsConnection.fail': 'notifyConnectionFail'
    },

    requests: {
      userGetRequest: function(id) {
        return {
          url: '/api/v2/users/' + id + '.json',
          type:'GET',
          dataType: 'json'
        };
      },

      newBrightRepsConnection: function(ticket) {
        // https://support.zendesk.com/hc/en-us/articles/203903346
        return {
          url: 'http://127.0.0.1:8000/api/connections/',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(ticket)
        };
      }
    },

    sayHello: function() {
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {
        username: currentUser
      });
    },

    getInfo: function() {
      var id = this.ticket().requester().id();
      this.ajax('userGetRequest', id);
    },

    showInfo: function(data) {
      console.log("DATA", data);
      this.switchTo('requester', data);
    },

    showError: function() {
      this.switchTo('error');
    },

    showBrightRepsButton: function() {
      this.switchTo('button');
    },

    sendToBrightReps: function() {
      var id = this.ticket().id();
      var ticketData = {zendesk_ticket_id: id};
      this.ajax('newBrightRepsConnection', ticketData);
      console.log("SENT", id, " TO BRIGHTREPS");
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
