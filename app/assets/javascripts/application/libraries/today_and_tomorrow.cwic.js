function CwicTodayAndTomorrow(options) {
  this.options = $.extend({
    container: 'schedule-container',
    organisation_id: 0,
    updateTimeout: 300000
  }, options || {});

  this.container = $('#' + this.options.container);
  if(this.container.data('today-and-tomorrow-view-initialized')) {
    return;
  }
  this.container.data('today-and-tomorrow-view-initialized', true);
  this.updateInterval = null;
  this.renderTodayAndTomorrow();
}

CwicTodayAndTomorrow.prototype.renderTodayAndTomorrow = function() {
  var tat = this;
  this.bindEntityInfoControls();
  if(typeof WebSocketRails !== 'undefined') {
    this.initWebSocket();
  }
  this.updateTodayTomorrowView();
  this.updateInterval = setInterval(function() { tat.updateTodayTomorrowView(); }, tat.options.updateTimeout);
};

CwicTodayAndTomorrow.prototype.initWebSocket = function() {
  var tat = this;
  var dispatcher = new WebSocketRails(websocket_url);

  // Open reservations_channel for organisation
  if(typeof window.cwic_today_and_tomorrow_channel === 'undefined') {
    window.cwic_today_and_tomorrow_channel = dispatcher.subscribe('todayandtomorrows_' + this.options.organisation_id);
    window.cwic_today_and_tomorrow_channel.bind('update', function() { tat.scheduleFastUpdate(); });
  }
};

CwicTodayAndTomorrow.prototype.scheduleFastUpdate = function() {
  var tat = this;
  if(this.updateInterval) {
    console.log('interupting normal update interval.');
    clearInterval(this.updateInterval);
    this.updateInterval = null;
    setTimeout(function() {
      tat.updateTodayTomorrowView();
      tat.updateInterval = setInterval(function() { tat.updateTodayTomorrowView(); }, tat.options.updateTimeout);
      console.log('continuing with normal update interval.');
    }, 3000);
    console.log('fast update scheduled for 3 sec...');
  } // else: There is already a fast update scheduled, do nothing
};

CwicTodayAndTomorrow.prototype.bindEntityInfoControls = function() {
  this.container.find('p.entity-name').on('click', function() {
    var $description = $(this).siblings('.entity-description');
    var descriptionHeight = $description.height();

    if($description.hasClass('opened')) {
      $description.velocity({height: 0}, 200, 'swing', function(){
        $description.css({display: 'none', height: 'auto'}).removeClass('opened');
      });
    } else {
      $description.css({height: 0, display: 'block'});
      $description.velocity({height: descriptionHeight}, 200, 'swing', function() {
        $description.css({height: 'auto'}).addClass('opened');
      });
    }
  });
};

CwicTodayAndTomorrow.prototype.updateTodayTomorrowView = function() {
  var tat = this;
  $.ajax({
    url: Routes.organisation_today_and_tomorrow_reservations_path(current_organisation)
  }).success(function(response) {
    tat.updateTodayTomorrowEntities(response.entities);
  });
};

CwicTodayAndTomorrow.prototype.updateTodayTomorrowEntities = function(entities) {
  $('div.entity div.updated-info').html('').append(APP.util.getTemplateClone('noReservationsTemplate'));
  for(var ei in entities) {
    var entity = entities[ei];
    var jentity = $('#entity_' + entity.id + ' div.updated-info');
    this.createNewUpdatedInfo(entity, jentity);
  }
};

CwicTodayAndTomorrow.prototype.getReservationProgress = function(begin_moment, end_moment) {
  return this.momentToPercent(begin_moment, end_moment, moment());
};

CwicTodayAndTomorrow.prototype.momentToPercent = function(begin_moment, end_moment, pointer) {
  var length = end_moment.diff(begin_moment, 'seconds');
  return pointer.diff(begin_moment, 'seconds') / length * 100.0;
};

CwicTodayAndTomorrow.prototype.appendOneLineReservations = function(reservations, container, referenceMoment) {
  referenceMoment = referenceMoment || moment();
  for(up_nr in reservations) {
    reservation = reservations[up_nr];
    line = APP.util.getTemplateClone('reservationLineTemplate');
    begin_moment = moment(reservation.begins_at);
    end_moment = moment(reservation.ends_at);

    // Only show the date if the moment is nog on the current day
    var begin_format = (begin_moment.isSame(referenceMoment, 'day')) ? 'LT' : 'lll';
    var end_format = (end_moment.isSame(referenceMoment, 'day')) ? 'LT' : 'lll';
    line.find('span.time').text(begin_moment.format(begin_format) + ' - ' + end_moment.format(end_format));
    descr = line.find('a.description');
    descr.text(reservation.full_instance_name);
    descr.attr('href', Routes.organisation_reservation_path(current_organisation, reservation.id));
    container.append(line);
  }
};

CwicTodayAndTomorrow.prototype.addDaySeparators = function(begin_moment, end_moment, progress_bar) {
  var num_days = end_moment.diff(begin_moment, 'days');
  var pointer = moment(begin_moment).startOf('day');
  for(var i = 0; i <= num_days; i++) {
    pointer = pointer.add(1, 'day');
    if(pointer.isBefore(end_moment)) {
      progress_bar.append($('<div>', { 'class': 'day-separator', css: { left: this.momentToPercent(begin_moment, end_moment, pointer) + '%' } }));
    }
  }
};

CwicTodayAndTomorrow.prototype.createNewUpdatedInfo = function(entity, parentdiv) {
  var reservation, begin_moment, end_moment, line, descr;

  if(entity.current_reservation != null || entity.reservations_today.length > 0 || entity.reservations_tomorrow.length > 0) {
    parentdiv.find('p.no-reservations').remove();
  }

  if(entity.current_reservation != null) {
    reservation = entity.current_reservation;
    begin_moment = moment(reservation.begins_at);
    end_moment = moment(reservation.ends_at);

    var currentInfo = APP.util.getTemplateClone('currentReservationTemplate');

    currentInfo.find('.reservation-description').text(reservation.full_instance_name);
    currentInfo.find('.begin-time').text(begin_moment.format('LT'));
    currentInfo.find('.end-time').text(end_moment.format('LT'));

    // Set progressbar
    var progress_bar = currentInfo.find('.progress-bar-container');
    progress_bar.find('span').css('width', this.getReservationProgress(begin_moment, end_moment) + '%');
    // Check if event is multiple day event
    if(!begin_moment.isSame(end_moment, 'day')) {
      currentInfo.find('.begin-date').text(begin_moment.format('l'));
      currentInfo.find('.end-date').text(end_moment.format('l'));
      currentInfo.find('.date-info').show();
      this.addDaySeparators(begin_moment, end_moment, progress_bar);
    }

    parentdiv.append(currentInfo);
    if(entity.reservations_today.length > 0 || entity.reservations_tomorrow.length > 0) {
      parentdiv.append($('<div>', {'class': 'reservation-separator'}));
    }
  }

  if(entity.reservations_today.length > 0 || entity.reservations_tomorrow.length > 0) {
    var nextInfo = APP.util.getTemplateClone('nextReservationsTemplate');
    this.appendOneLineReservations(entity.reservations_today, nextInfo);
    if(entity.reservations_tomorrow.length > 0) {
      nextInfo.append(APP.util.getTemplateClone('tomorrowLineTemplate'));
      this.appendOneLineReservations(entity.reservations_tomorrow, nextInfo, moment().add(1, 'day'));
    }
    parentdiv.append(nextInfo);
  }
};
