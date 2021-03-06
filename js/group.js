var student_grouping = student_grouping || {};

student_grouping.group = function(groupData){
	var me = this;
	this.pubSub = PubSub;
	
	this.dirty = false;
	this.groupData = groupData;
	this.students = [];
	
	this.groupContainerId = '';
	this.groupContainerClass = '.group-container';
	this.groupClass = '.group';
	this.groupNameClass = '.group-name';
	this.groupNameLblClass = '.group-name-lbl';
	this.groupNameTxtClass = '.group-name-txt';
	
	this.groupControlsClass = '.group-controls';
	this.delGroupBtnClass = '.del-group-btn';
	this.saveGroupBtnClass = '.save-group-btn';
	this.expColGroupBtnClass = '.exp-col-group-btn';
	this.expandedClass = 'expanded'; // not using as selector so don't need the .
	this.collapsedClass = 'collapsed'; // not using as selector so don't need the .
	this.collapsed = false;
	
	this.addDataDivClass = '.add-data-div';
	this.addDataBtnClass = '.add-data-button';
	
	this.selectedAttributes = [];
	this.originalRightMargin = 0;
	
	this.groupCloseBtnClass = '.group-close-btn';
			
	this.groupPopoverClass= '.group-popover';
	this.studentPopoverElem = '#student-data-popover';	
	
	this.groupInfoBtnClass = '.group-info-btn';
	this.groupInfoPopoverElem = '#group-description-popover';
	this.groupDescriptionTxtElem = '#group-description-text';
	this.groupDescriptionTxtAreaElem = '#group-description-textarea';
	
	this.groupAttachmentImgClass = '.group-attachment-img';
	this.groupAttachmentPopoverElem = '#group-attachment-popover';
	this.groupAttachmentPopoverFileInput = '#real-upload-txt';
	this.groupAttachmentPopoverFileTxt = '#fake-upload-txt';
	this.groupAttachmentPopoverDoneBtnElem = '#attachment-done-btn';	
	this.groupAttachmentLblClass = '.group-attachment-lbl';
	this.groupAttachmentDivClass = '.group-file-attachment';
	this.groupAttachmentNameClass = '.file-attachment-name';
	this.groupAttachmentDelImgClass = '.del-attachment-img';
	this.attachedFile = null;
	
	this.groupUnsavedChangesModalElem = '#group-unsaved-changes-modal';
	this.groupUnsavedChangesGroupName = '#group-unsaved-changes-group-name';
	this.groupUnsavedChangesConfirmBtnElem = '#group-unsaved-changes-confirm-btn';
	/**
	 * HTML template to be rendered to screen 
	 */
	this.groupContainerTemplate='<div class="group-container disable-select">' +
									'<div class="group-controls">' +
										'<button class="btn btn-link del-group-btn">delete</button>' +
										'<button class="btn btn-link save-group-btn">save</button>' + 
										'<button class="btn btn-link exp-col-group-btn">collapse</button>' +  
									'</div>' + 
									'<div class="group-name">' +
										'<div class="group-name-lbl"></div>' + 
										'<input type="text" class="group-name-txt" style="display:none; width:10em; height:1em; background-color:transparent; text-align:center; color:white; border-color:transparent"/></div>' +
									'<img class="hide-button group-close-btn" src="img/group-close-icon.png"></img>' +
									'<img class="hide-button group-info-btn" src="img/group-info-icon.png"></img>' + 
									'<div class="group"></div>' + 
									'<div>' +
										'<img class="group-attachment-img" src="img/attachment-icon.png"/>' +
										'<span class="group-attachment-lbl"></span>' + 
									'</div>' + 
									'<div class="add-data-div">' +
										'<button class="add-data-button btn btn-link">add data</button>' +
									'</div>' +
									'<div class="group-file-attachment">' + 
										'<span class="file-attachment-name"/>' + 
										'<img class="del-attachment-img" src="img/trash-icon.png"/>' +
									'</div>' + 
								'</div>';
			
	this.droppedElemClass = '.dropped-elem';
	this.studentAttributesClass = '.student-attributes';					
	this.droppedElemTemplate = "<div data-studentId='' class='dropped-elem'>" +					
									"<img class='del-button' src='img/student-close-icon.png'></img>" +
									'<div class="student-icon-div"><img class="student-icon" src="img/student-icon-male.png"/></div>' + 
									"<div class='student-name'></div>" + 
									"<div class='student-attributes'></div>" + 				
								"</div>";				
								
	/**************************
     * METHODS
     **************************/
	
	this.init = function() {
		var me = this;
		var groupContainer = $("#gc" + this.groupData.id); 
		$(groupContainer).find(this.addDataBtnClass).click(function(event){
			me.showStudentDataPopup();
		});
		
		$(groupContainer).find(this.groupInfoBtnClass).click(function(event){
			me.showMoreInfoPopup();
		});
		
		$(groupContainer).find(this.groupAttachmentImgClass).click(function(event){
			me.showAttachmentPopover();
		});
		
		$(groupContainer).find(this.groupAttachmentDelImgClass).click(function(event){
			me.deleteAttachment();
		});
		
		$(groupContainer).find(this.expColGroupBtnClass).click(function(event){
			me.toggleStudentState();
		});
		
		$(groupContainer).find(this.groupCloseBtnClass).click(function(event){
			me.closeGroup();
		});
		
		$(groupContainer).find(this.delGroupBtnClass).click(function(event){
			
		});
		
		$(groupContainer).find(this.groupNameClass).click(function(event){
			me.makeGroupNameEditable();
		});
		
		this.groupContainerId = groupContainer;
		this.originalRightMargin = parseInt($(this.groupContainerId).css('margin-right').replace('px',''));

		// render students assigned to this group
		var studentIds = this.groupData.students;
		_.each(studentIds, function(studentId){
			
			// TODO refactor dependency on studentsList
			var student = student_grouping.studentsListComponent.getStudentById(studentId);
			if (student !== undefined){			
				me.assignStudentToGroup(student);	
			}
		});		
		
		// TODO load attach lesson plan
	};
		
	/**
	 * Add the given student html elem to the given group
	 * @param {Object} student
	 */
	this.assignStudentToGroup = function(student){
		var studentId = student.studentData.id;	
		var groupId = this.groupData.id;
			
		// check if elem is in group already		
		if ($("#" + groupId + " #dr-" + studentId).length === 0){	
			var droppedElem = this.createDroppedElem(student.studentData);
			$("#" + groupId).append(droppedElem);
			
			// make it draggable to another group
			$(droppedElem).draggable({
				drag: function(event, ui){
					
					// TODO refactor shortcut to groupList component
					student_grouping.groupsListComponent.currGrp = null;
				},
				revert:"invalid",
				"helper":"clone", 
				"opacity":0.7 
			});
			
			// add student to list of students
			this.students.push(student);			
			student.addGroupIndicator(this.groupData.id, this.groupData.color);					
		}
	}
	
	
	/**
	 * Removes the selected student from its group  
	 * @param {String} studentId
	 */
	this.removeStudent = function(studentId){		
		var studentElem = $(this.groupContainerId).find('.dropped-elem[data-studentId="'+ studentId + '"]');
		
		// find student object from list 
		var student = _.find(this.students, function(s){
			return s.studentData.id === studentId;
		});
		
		student.removeGroupIndicator(this.groupData.id);
		
		// remove from list of students
		this.students = _.filter(this.students, function(s){
			return s.studentData.id !== studentId;
		});
		
		// remove the student inside the group
		$(studentElem).remove();
		 
		this.markDirty();
	}
	
	/**
	 * Returns true if the group already contains the student with the given id 
	 */
	this.hasStudent = function(studentId){
		var student = _.find(this.students, function(s){
			return s.studentData.id === studentId;
		});
		return student !== undefined;
	}

	
	/**
	 * Create group indicator for the given student
	 * @param {Object} student
	 */
	this.createDroppedElem = function(student){
		var me = this;
		var elemDiv = $(this.droppedElemTemplate);
		$(elemDiv).attr('id', 'dr-' + student.id);
		$(elemDiv).attr('data-studentId', student.id);
		$(elemDiv).find('.student-name').html(student.name);
		var attributesDiv = $(elemDiv).find('.student-attributes');
		
		var state = this.collapsed ? this.collapsedClass : this.expandedClass;
		$(elemDiv).addClass(state);
		
		me.appendStudentAttributes(attributesDiv, student, me.selectedAttributes);	
		var closeBtn = $(elemDiv).find('.del-button');
		$(closeBtn).click(function(event){
			me.removeStudent(student.id);
		});
		return elemDiv;		
	}
	
	/**
	 * TODO can optimize code to run faster 
	 * Add / Remove student attributes
	 */
	this.toggleStudentAttributeVisibility = function(selectedAttributes) {
		
		var me = this;
		$("#gc" + me.groupData.id + " .dropped-elem").each(function(index, item){			
			
			var studentId = $(item).attr('data-studentId');
			var student = _.find(me.students, function(s){
				return s.studentData.id === studentId;
			});
			var studentData = student.studentData;
			
			var attributesDiv = $(item).find('.student-attributes');
			$(attributesDiv).empty();			
			me.appendStudentAttributes(attributesDiv, studentData, me.selectedAttributes);	
		});		
	}
	
	this.appendStudentAttributes = function(attributesDiv, studentData, attributes){		
		_.each(attributes, function(attribute){				
			$(attributesDiv).append("<div>" + attribute + " " + studentData[attribute] + "</div>");
		});
	}

	/**
	 * Fill html template with group data
	 */
	this.generateTemplate = function(){
		var groupData = this.groupData;
		var template = $(this.groupContainerTemplate);
		$(template).attr('id', 'gc' + groupData.id);
		$(template).css('background-color', groupData.color);
		
		var groupNameLbl = $(template).find(this.groupNameLblClass);
		$(groupNameLbl).html(groupData.cohortIdentifier);
		
		var groupNameDiv = $(template).find(this.groupNameClass);		
		$(groupNameDiv).css('background-color', groupData.titleColor);
		
		var groupDiv = $(template).find(this.groupClass);
		$(groupDiv).attr('id', groupData.id);
		
		return template;
	}	

	/**
	 * Popup the menu for selecting the student data attributes to display
	 */
	this.showStudentDataPopup = function(){
		
		// hide the other popovers
		 $(this.groupInfoPopoverElem).hide();
		$(this.groupAttachmentPopoverElem).hide();
		
		// reset right margins
		$(this.groupContainerClass).css('margin-right', this.originalRightMargin);
		
		var groupContainerId = "gc" + this.groupData.id;
		var groupContainer = $("#" + groupContainerId);
		
		var popover = $(this.studentPopoverElem);
		var popoverGroupContainerId = $(popover).attr('data-groupContainerId');
		
		// check if popover is already open 
		var notOpen = $(popover).css('display') === 'none';
		if (notOpen || groupContainerId !== popoverGroupContainerId) {	
			
			// expand right margin to accomodate the popover
			var popoverWidth = $(popover).width();			
			$(this.groupContainerId).css('margin-right', this.originalRightMargin + popoverWidth);	
					
			// place the popover relative to the group container
			var position_size = this.getPositionAndSize(); 
			
			$(popover).attr('data-groupContainerId', groupContainerId);
			$(popover).css('left', position_size.left + position_size.width);
			$(popover).css('height', position_size.height);
			$(popover).css('top', position_size.top);
			$(popover).css('display','');	
			
		} else {
			// close it
			$(popover).css('display','none');
		}
		
		var me = this;
		var attributeCheckBoxes = this.studentPopoverElem + " .cbox-student-attribute";
		$(attributeCheckBoxes).attr('checked', false);
		_.each(this.selectedAttributes, function(attribute){
			$(attributeCheckBoxes + "[value='" + attribute + "']").attr('checked', true);
		});
		
		$(attributeCheckBoxes).unbind('click');
		$(attributeCheckBoxes).click(function(event){
			var cbox = event.currentTarget;
			me.toggleSelectedAttributes();
			me.toggleStudentAttributeVisibility(me.selectedAttributes);
		})
	}
	
	/**
	 *  Repopulate the list of selected attributes with the user-selected attributes
	 */
	this.toggleSelectedAttributes = function(){
		var me = this;
		this.selectedAttributes = [];
		$(this.studentPopoverElem + " .cbox-student-attribute").each(function(index, elem){
			var selected = $(elem).is(":checked");
			if (selected){
				var val = $(elem).val();
				me.selectedAttributes.push(val);
			}
		});
		
		this.markDirty();
	}
	
	/**
	 * TODO optimize hidding code
	 * Popup the menu to show the group description 
	 */
	this.showMoreInfoPopup = function(){
		
		// hide the other popovers
		$(this.studentPopoverElem).hide();
		$(this.groupAttachmentPopoverElem).hide();
		
		// reset right margins
		$(this.groupContainerClass).css('margin-right', this.originalRightMargin);
		
		var groupContainerId = "gc" + this.groupData.id;
		var groupContainer = $("#" + groupContainerId);
		
		var popover = $(this.groupInfoPopoverElem);
		var popoverGroupContainerId = $(popover).attr('data-groupContainerId');
		
		// check if popover is already open 
		var notOpen = $(popover).css('display') === 'none';
		if (notOpen || groupContainerId !== popoverGroupContainerId) {		
			
			var description = this.groupData.cohortDescription;
			$(this.groupDescriptionTxtElem).html(description);
						
			// expand right margin to accomodate the popover
			var popoverWidth = $(popover).width();			
			$(this.groupContainerId).css('margin-right', this.originalRightMargin + popoverWidth);
			
			// place the popover relative to the group container
			var position_size = this.getPositionAndSize(); 
			
			$(popover).attr('data-groupContainerId', groupContainerId);
			$(popover).css('left', position_size.left + position_size.width);
			$(popover).css('height', position_size.height);
			$(popover).css('top', position_size.top);
			$(popover).css('display','');		
			
			// if user clicks on text, make it editable					
			$(this.groupDescriptionTxtElem).click(function(event){
				me.makeGroupDescriptionEditable();
			});	
				
		} else {
			// close it
			$(popover).css('display','none');
		}	
	}
	
	/**
	 * Popup the attachment panel
	 */
	this.showAttachmentPopover = function(){
		
		if (me.attachedFile === null){
			var groupContainerId = "gc" + this.groupData.id;
			var groupContainer = $("#" + groupContainerId);
			
			var popover = $(this.groupAttachmentPopoverElem);
			var popoverGroupContainerId = $(popover).attr('data-groupContainerId');
			
			// check if popover is already open
			var notOpen = $(popover).css('display') === 'none';
			if (notOpen || groupContainerId !== popoverGroupContainerId) {
				
				// place the popover relative to the group container
				var position = $(groupContainer).position();
				var height = $(groupContainer).height();
				
				$(popover).attr('data-groupContainerId', groupContainerId);
				$(popover).css('left', position.left);
				$(popover).css('top', position.top + height);
				$(popover).css('display', '');
							
				$(this.groupAttachmentPopoverDoneBtnElem).unbind('click');
				$(this.groupAttachmentPopoverDoneBtnElem).click(this.attachFile);
				
				$(this.groupAttachmentPopoverFileInput).val('');
				$(this.groupAttachmentPopoverFileTxt).val('');
				$(this.groupAttachmentPopoverFileInput).unbind('change');
				$(this.groupAttachmentPopoverFileInput).change(function(){
					$(me.groupAttachmentPopoverFileTxt).val($(me.groupAttachmentPopoverFileInput).val());
				});
			} else {
				// close it
				$(popover).css('display', 'none');
			}
		}		
	}
	
	/**
	 * Attach the user specified file to this   
	 */
	this.attachFile = function(event){
		var file = document.getElementById('real-upload-txt').files[0];
		if (file !== undefined){
			me.attachedFile = file;
			
			var reader = new FileReader();

		    // Closure to capture the file information.
		     reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.
		        var result = e.target.result;
		        var contentStartIndex = result.indexOf(',');
		        var type = result.substring(0, contentStartIndex);
		        var content = result.substring(contentStartIndex+1);
		        me.attachedFile = {
		        	name: file.name,
		        	type: type,
		        	content: content
		        }
		      };
		    })(file);
		
		    // Read in the image file as a data URL.
		    reader.readAsDataURL(file);
			
			// hide the popover			
			$(me.groupAttachmentPopoverElem).hide();	
			
			// show the div with the attachment
			me.showFileAttachment();
			
			me.markDirty();			
		} else {
			me.attachedFile = null;
		}		
	}
	
	/**
	 * Remove the attachment from the group 
	 */
	this.deleteAttachment = function(event){
		/**me.attachedFile = null;
		$(me.groupContainerId).find(me.groupAttachmentNameClass).html('');
		$(me.groupContainerId).find(me.groupAttachmentDivClass).hide();
		
		this.markDirty();**/
		var content = docx(me.attachedFile.content);
		$("#doc-div").append(content.DOM);
	}	
	
	/**
	 * Show the attached file
	 */
	this.showFileAttachment = function(){
		var file = this.attachedFile;		
		$(me.groupContainerId).find(me.groupAttachmentNameClass).html(file.name);
		$(me.groupContainerId).find(me.groupAttachmentDivClass).show();
	}
	
	/**
	 * Toggle student expanded/collapsed state 
	 */
	this.toggleStudentState = function() {		
		
		var classToRemove = this.collapsed ? this.collapsedClass : this.expandedClass;
		var classToAdd = this.collapsed ? this.expandedClass : this.collapsedClass;
		
		var droppedElem = $(this.groupContainerId).find(this.droppedElemClass);
		$(droppedElem).removeClass(classToRemove);
		$(droppedElem).addClass(classToAdd);		
		
		this.collapsed = !this.collapsed;
		
		// show/hide student attributes
		this.collapsed ? $(droppedElem).find(this.studentAttributesClass).hide() 
			: $(droppedElem).find(this.studentAttributesClass).show();		
		
		var btnTxt = this.collapsed ? 'expand' : 'collapse';
		$(this.expColGroupBtnClass).html(btnTxt);		
	}
	
	/**
	 * Close the group 
	 */
	this.closeGroup = function(){
		
		if (this.dirty){				
		    $(this.groupUnsavedChangesGroupName).html(this.groupData.cohortIdentifier);
		    
			$(this.groupUnsavedChangesConfirmBtnElem).unbind('click');
			$(this.groupUnsavedChangesConfirmBtnElem).click(function(){
				me.dirty = false;
				me.closeGroup();
			});
			
			$(this.groupUnsavedChangesModalElem).modal('show');
		} else {		
			$(this.groupContainerId).remove();		
			this.pubSub.publish('remove-group', this.groupData.id);	
		}
		
	}
	
	/**
	 * Make the group name label editable, turns it into a textbox
	 */
	this.makeGroupNameEditable = function(){
		var groupName = $(this.groupContainerId).find(this.groupNameLblClass).html();
		$(this.groupContainerId).find(this.groupNameLblClass).hide();
		
		$(this.groupContainerId).find(this.groupNameTxtClass)
			.val(groupName)
			.css('display', '')
			.focus();
											
		$(this.groupContainerId).find(this.groupNameTxtClass).blur(function(event){
			me.saveGroupName();
		});
	}
	
	/**
	 * Save the new group name 
	 */
	this.saveGroupName = function(){
		var newGroupName = $(this.groupContainerId).find(this.groupNameTxtClass).val();
		this.groupData.cohortIdentifier = newGroupName;
		$(this.groupContainerId).find(this.groupNameLblClass).html(newGroupName);
		$(this.groupContainerId).find(this.groupNameLblClass).show();
		$(this.groupContainerId).find(this.groupNameTxtClass).hide();
		
		this.markDirty();
	}
	
	/**
	 * Make the group description text editable, turns it into a textarea
	 */
	this.makeGroupDescriptionEditable = function(){
		var groupDescription = this.groupData.cohortDescription;
		$(this.groupDescriptionTxtElem).hide();
		
		var height = $(this.groupInfoPopoverElem).css('height').replace('px','');	
		$(this.groupDescriptionTxtAreaElem).css('height', parseInt(height)-40);
		$(this.groupDescriptionTxtAreaElem)
			.val(groupDescription)
			.show()
			.focus();		
			
		$(this.groupDescriptionTxtAreaElem).unbind('blur');				
		$(this.groupDescriptionTxtAreaElem).blur(function(event){
			me.saveGroupDescription();
		});	
	}
	
	/**
	 *  Save the new group description
	 */
	this.saveGroupDescription = function(){
		var newGroupDescription = $(this.groupDescriptionTxtAreaElem).val();
		this.groupData.cohortDescription = newGroupDescription;
		$(this.groupDescriptionTxtElem).html(newGroupDescription);
		$(this.groupDescriptionTxtAreaElem).hide();
		$(this.groupDescriptionTxtElem).show();
		
		this.markDirty();
	}
	
	
	/** USED TO REFACTOR LATER ON
	 * Returns the position and size of this group's container element 
	 */
	this.getPositionAndSize = function(){
		var position = $(this.groupContainerId).position();
		var width = $(this.groupContainerId).width(); 
		var height = $(this.groupContainerId).height();
		
		// need to subtract the height of the file attachment div if there is an attachment
		if (this.attachedFile !== null) {
			height -= $(this.groupAttachmentDivClass).height();
		}
		var position_size = {
			left: position.left,
			top: position.top,
			width: width,
			height: height
		}			
		return position_size;
	}
	
	this.setRightMargin = function(offset){
		$(this.groupContainerId).css('margin-right', this.originalRightMargin + offset);
	}
	
	/**
	 * Mark this group as dirty so that changes are saved back to server 
	 */
	this.markDirty = function(){
		this.dirty = true;
	}
}
