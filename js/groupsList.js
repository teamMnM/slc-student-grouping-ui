var student_grouping = student_grouping || {};

student_grouping.groupsList = function(){
	var me = this;
	
	this.pubSub = PubSub;
	
	// keep track of the current group we are dragging to
	this.currGrp = null;
	this.groups = [];
	this.lastNewGroupIndex = -1;
	
	this.groupClass = '.group';
	this.groupsAreaClass = '.groups-area';
	
	/**************************
     * METHODS
     **************************/
    this.init = function(){
    	
		for (var i = 0; i < fakeGroups.length; i++){
			var fakeGroup = fakeGroups[i];
			this.addGroup(fakeGroup);			
		}		
		
		this.pubSub.subscribe('add-group', function(group){
			me.addGroup(group);
		});
		
		this.pubSub.subscribe('remove-group', function(groupId){
			me.removeGroup(groupId);
		});
		
		this.pubSub.subscribe('assign-random', function(students, numInGroup){
			me.assignRandomGroups(students, numInGroup);
		});
    }
    
    /**
     * Add given group to the list 
     * @return the newly added group
     */
    this.addGroup = function(newGroup){
    	
    	// check if group has already been added
    	var groupExists = _.find(this.groups, function(g){
    		return g.groupData.id === newGroup.id;
    	}) !== undefined;
    	    	
    	if (!groupExists) {    	
	    	var group = new student_grouping.group(newGroup);
			$(this.groupsAreaClass).append(group.generateTemplate());
			group.init();
			
			// make group droppable
			$(group.groupContainerId).find('.group').droppable({
				drop: function(event){
					me.dropFunc(this);
				}		
			});	
			
			this.groups.push(group);
			
			return group;
		} else {
			//TODO tell user group is already there
		}
		
		return null;
    }
    
    /**
     * Remove the given group from the list 
     */
    this.removeGroup = function(groupId){
    	this.groups = _.filter(this.groups, function(g){
    		return g.groupData.id !== groupId;
    	});
    }
    
    /**
	 *Handle the drop action on a group 
	 */
	this.dropFunc = function(groupContainer){
		// we use currGrp to make sure that the students get dropped once
		// need to do this because the dropFunc is called for each dragged student
		if (this.currGrp === null){
			var groupId = $(groupContainer).attr('id');
			this.currGrp = groupId;
			
			// find the group object
			var group = _.find(this.groups, function(group){
				return group.groupData.id === groupId;
			});
			
			// loop through each student being dragged
			$(".ui-draggable-dragging").each(function(index, elem){
							
				var studentId = $(elem).attr('data-studentId');
					
				// find student obj TODO - refactor dependency
				var student = _.find(student_grouping.studentsListComponent.students, function(student){
					return student.studentData.id === studentId;
				});
				
				// check if are moving between groups
				if ($(elem).hasClass('dropped-elem')){
									
					// find the group this belongs to 
					var originalGroupId = $(elem).parents('.group').attr('id');
									
					// check if target group is indeed a different group
					if (originalGroupId !== groupId) {				
						// find the group object
						var originalGroup = _.find(me.groups, function(g){
							return g.groupData.id === originalGroupId;
						});
						
						// check that target group doesnt aleady have this student					
						var studentId = $(elem).attr('data-studentId');
						var groupHasStudent = group.hasStudent(studentId);
										
						if (!groupHasStudent) {
							originalGroup.removeStudent(studentId);		
							originalGroup.markDirty();				
						}	
					}				
				}
				
				// assign student to group
				group.assignStudentToGroup(student);
				group.markDirty();		
			});		
		}
	}
	
	/**
	 * Randomly assign the given students into groups of the specified number  
	 */
	this.assignRandomGroups = function(students, numInGroup){
		var students = utils.arrayUtils.shuffle(students);
		var groups = utils.arrayUtils.shuffle(this.groups);
		var numGroups = groups.length;
		
		// keep track of the next group that is not FULL
		var indexOfNextAvailableGroup = 0;
		_.each(students, function(student){
			var studentId = student.studentData.id;			
			if (!student.inAGroup()){
					
				// keep track of whether student has been assigned to the existing groups
				var addedToGroup = false;			
				for (var i = indexOfNextAvailableGroup; i < numGroups; i++){
					var group = groups[i];
					if (group.students.length < numInGroup && !group.hasStudent(studentId)){
						group.assignStudentToGroup(student);
						
						addedToGroup = true;
						break;
					} else if (group.students.length === numInGroup){
						indexOfNextAvailableGroup++;
					}					
				}
				
				// TODO randomize color
				// should create a new group if student was not added to any existing group
				if (!addedToGroup){
					
					var group = {
			    		id : 'g' +  me.lastNewGroupIndex++,
			    		cohortIdentifier : 'New Group',
			    		cohortDescription : '',
			    		color: '#FFA5A4',
			    		titleColor: '#A9322F'
			    	};
			    	
			    	var newGroupObject = me.addGroup(group);
			    	newGroupObject.assignStudentToGroup(student);					
			    	numGroups++;
				}
			}
		});		
	}
	
	/**
	 * Returns true if the given group exists in this component's list of groups 
	 */
	this.containsGroup = function(groupId){
		
		var existingGroup = _.find(this.groups, function(g){
			return g.groupData.id === groupId;
		});
		return existingGroup !== undefined;
	}
	

}
