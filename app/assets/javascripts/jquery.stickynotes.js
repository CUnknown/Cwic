IADAStickyNotes.prototype.options = null;
IADAStickyNotes.prototype.noteContainer = null;
IADAStickyNotes.prototype.notes = [];

IADAStickyNotes.prototype.defaultNote = {
        id: null,
        sticky_text: 'Text',
        author: {author_id, author_name},
        weight: 0,
        created_at: '',
}

function IADAStickyNotes(options) {

    this.options = Object.extend({
        container: 'note-container',
        backend_url: 'url to backend',
        current_author: { author_id: 0, author_name: 'Name' },
        placeholder: 'Text'
    }, options || {});

    this.noteContainer = $('#' + this.options.container);

    this.bindControls();

    this.getNotes();
}

IADAStickyNotes.prototype.getNotes = function() {
    var sn = this;

    $.ajax({
            type: 'GET',
            url: this.options.backend_url + '.json',
        }).fail(function(){
            window.log("Error getting notes");
        }).success(function(response) {
            if(response.length > 0) {
                sn.notes = reponse.stickies;
                sn.renderNotes();
            }
        });

}

IADAStickyNotes.prototype.saveNote = function(note_obj) {
    $.ajax({
        type: 'POST',
        url: this.options.backend_url + '/' + note_obj.id + '.json',
        data: {
            sticky: note_obj,
        },
    }).fail(function(){
        window.log("Error saving");
    }).success(function(response) {
        if(response.stickies.length > 0) {
            sn.notes = reponse.stickies;
            sn.renderNotes();
        }
    });
}

IADAStickyNotes.prototype.renderNotes = function() {
    for(noteNr in this.notes) {
        current = this.notes[noteNr];
        this.renderNote(current);
    }
}

IADAStickyNotes.prototype.bindControls = function() {
	var sn = this;
	$('button.new-sticky').on('click', function() { sn.newNote(); });
}

IADAStickyNotes.prototype.newNote = function() {
    var note = this.defaultNote;
    note.text = this.options.placeholder;
    note.user_id = this.options.current_author.author_id;
    this.renderNote(this.defaultNote);
}


IADAStickyNotes.prototype.renderNote = function(note_obj) {
	var sn = this;
    var temp = $("#note-template").html();
    var note = $("<div class='note'></div>").html(temp);

    // add id
    if(note_obj.id != null) {
    	note.attr('id', 'note_' + note_json_note.id);
        note.find('p.author_name').text(note_obj.author.author_name);
        note.find('p.created_at').text(note_obj.created_at);
    } else {
    	note.addClass('new_note');
        note.find('p.author').text(this.options.current_author.author_name);
    }

    // Bind sticky events
    note.find('div.delete-button').on('click', function(){ sn.deleteNote(this); });

    var textarea = note.find('textarea');
    textarea.val(note_obj.text);
	textarea.on('blur', function(){ sn.afterNoteEdit(); });
	textarea.autogrow();

    var innerNotesContainer = this.noteContainer.find('div.notes');
    innerNotesContainer.sortable({
        connectWith: ".notes",
        start: function(e, ui){
            ui.placeholder.height(ui.item.outerHeight());
            ui.placeholder.width(ui.item.outerWidth());
        },
    placeholder: "ui-state-highlight",
    });

    innerNotesContainer.append(note);

}

IADAStickyNotes.prototype.afterNoteMove = function(ui) {
	console.debug('Update stickynote position');
}

IADAStickyNotes.prototype.afterNoteEdit = function() {
	console.debug('Update stickynote text');
}

IADAStickyNotes.prototype.deleteNote = function(element) {
    $(element).parents(".note").remove();
}

IADAStickyNotes.prototype.updateNoteInfo = function(note_element, noteid) {
    for(noteNr in this.notes) {
        current = this.notes[noteNr];
        if(current.id == noteid) {

            var notePercentPos = positionToPercentageDocument(note_element.position);

            current.pos_x = notePercentPos.x;
            current.pos_y = notePercentPos.x;
            current.width = note_element.width();
            current.height = note_element.height();

            return current;
        }
    }
    return null;
}

IADAStickyNotes.prototype.positionToPercentageDocument = function(position) {
    return {x: position.x.toFixed() / document.width() * 100.0, y: position.y.toFixed() / document.height() * 100.0};
}