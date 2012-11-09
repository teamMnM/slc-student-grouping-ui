var student_grouping = student_grouping || {};

student_grouping.student = function(studentData) {
	this.studentData = studentData;
	this.studentLiContainer = '';
	this.studentLiContainerClass = '.studentListItem';
	this.studentLiSelectedClass = 'studentListItem-selected'; // not using as selector, so dont need the .
	
	this.idAttributeName = 'data-studentId';
	this.listItemClass = '.studentListItem';	
	this.groupIndicatorsClass = '.group-indicators';
	
	// student info popover
	this.studentInfoBtnClass = '.student-info-btn';
	this.studentInfoPopoverElem = '#student-info-popover';
	this.studentInfoAttributesElem = '#student-attributes';
	this.studentInfoTestScoreElem = '#student-testScore-chart';
	this.studentInfoLearningStyleElem = '#student-learningStyle-chart';
	
	// student attributes
	this.nameClass = '.student-name';
	this.iconClass = '.student-icon';
	this.gpaClass = '.gpa';
	this.selBoxClass = '.student-selBox';
	
	/**
	 * HTML template to be rendered to screen 
	 */
	this.listItemTemplate = '<li data-studentId="" class="studentListItem multidraggable disable-select">' +
								'<div class="group-indicators"></div>' +
								'<div class="student-icon-div"><img class="student-icon"/></div>' +								
								'<div>' +
									'<span class="student-name"></span>' + 
									'<button class="hide-button student-info-btn">i</button>' + 
									'<br>GPA <span class="gpa"></span>' +		
									'<input type="checkbox" class="student-selBox"/>' +							
								'</div>' +																			
							'</li>';
    
    /**************************
     * METHODS
     **************************/
    
    /**
     * Attach event handlers 
     */
    this.init = function(){
    	var me = this;
    	
    	this.studentLiContainer = "li[data-studentId='" + this.studentData.studentId + "']"; 
		$(this.studentLiContainer).find(this.selBoxClass)
			.change(function(event){
				var elem = event.currentTarget;	
				var selected = $(elem).prop('checked');
				me.toggleStudentSelection(selected);
				
				//notify others that a student has been selected/deselected
				me.pubSub.publish('student-selection-changed', me.studentData.studentId);
			});	
			
		$(this.studentLiContainer).find(this.studentInfoBtnClass).click(function(event){					
			me.showStudentInfoPopover();
		});
		
		$(this.studentLiContainer).click(function(event){
			// close the student info popover if still open
			var popoverStudentId = $(me.studentInfoPopoverElem).attr('data-studentContainerId');
			if (popoverStudentId !== me.studentData.studentId){			
				$(me.studentInfoPopoverElem).hide();	
			}
			
			$(me.studentLiContainerClass).removeClass(me.studentLiSelectedClass);
			$(this).addClass(me.studentLiSelectedClass);
		});
    };
    
    /**
	 * Select/deselect this student
	 * @param {Boolean} selected
	 */
	this.toggleStudentSelection = function(selected){			
		if (selected){
			$(this.studentLiContainer).addClass('ui-multidraggable');		
		} else {
			$(this.studentLiContainer).removeClass('ui-multidraggable');
		}
	},
	
	/**
	 * Add group indicator to this student
	 * @param {String} groupId
	 * @param {String} color 
	 */
	this.addGroupIndicator = function(groupId, color) {
		$("li[data-studentId='" + this.studentData.studentId + "']").find(this.groupIndicatorsClass)
			.append("<div data-groupId='" + groupId + "' class='circle' style='background-color: " + color + "'/>");
	}
	
	/**
	 * Remove the group indicator for the given group	 
	 * @param {String} groupId
	 */
	this.removeGroupIndicator = function(groupId) {		
		$("li[data-studentId='" + this.studentData.studentId + "']")
			.find("div[data-groupId='" + groupId + "']").remove();
	}
	
	/**
	 * Fill html template with student data
	 */
	this.generateTemplate = function(){
		var studentData = this.studentData;
		var template = $(this.listItemTemplate);
		$(template).attr('data-studentId', studentData.studentId);			
		$(template).find(this.nameClass).html(studentData.studentName);
		$(template).find(this.iconClass).attr('src', 'img/student-icon-male.png');
		$(template).find(this.gpaClass).html(studentData.gpa);
		
		return template;
	}	
	
	/**
	 * Show/Hide this student
	 * @param {boolean} visible 
	 */
	this.toggleVisible = function(visible){
		if (visible) {
			$("li[data-studentId='" + this.studentData.studentId + "']").show();
		} else {
			$("li[data-studentId='" + this.studentData.studentId + "']").hide();
		}
	}	
	
	/**
	 * TODO add description
	 */
	this.showStudentInfoPopover = function() {
		var me = this;
		
		var studentContainer = $(this.studentLiContainer);
		var studentId = this.studentData.studentId;
		
		var popover = $(this.studentInfoPopoverElem);
		var popoverStudentContainerId = $(popover).attr('data-studentContainerId');
		
		// check if popover is already open
		var notOpen = $(popover).css('display') === 'none';
		if(notOpen || studentId !== popoverStudentContainerId) {
			
			// populate student info content
			$(this.studentInfoAttributesElem).empty();
			var attributesToShow = ['classes', 'gpa', 'disabilities'];
			_.each(attributesToShow, function(attr){
				var attributeDiv = me.populateAttributeDiv(attr);				
				$(me.studentInfoAttributesElem).append(attributeDiv);			
			});			
			
			// place the popover relative to the group container
			var position = $(studentContainer).position();
			var width = $(studentContainer).width(); 
			var height = $(studentContainer).height();
			
			$(popover).attr('data-studentContainerId', studentId);
			$(popover).css('left', position.left + width);
			$(popover).css('top', position.top);
			$(popover).css('display','');
		} else {
			// close it
			$(popover).css('display','none');
		}
	}			
	
	/**
	 * TODO add description 
	 */
	this.populateAttributeDiv = function(attribute){
		var div = $("<div>");
		$(div).append('<strong>' + attribute + ' : </strong>');
		
		var studentAttrVal = this.studentData[attribute];
		var str = ""
		if ($.isArray(studentAttrVal)){
			_.each(studentAttrVal, function(c){
				str += (c + ' ,');
			});
			str = str.substring(0,str.length-2);
		} else {
			str = studentAttrVal;
		}				
		
		$(div).append(str);
		return div;
	}
	
	/**
	 * Returns TRUE if this student is assigned to at least one group 
	 */
	this.inAGroup = function(){
		var inAGroup =  $(this.studentLiContainer).find(this.groupIndicatorsClass).children().length > 0;
		return inAGroup;
	}	
}
