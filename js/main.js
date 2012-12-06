var student_grouping = student_grouping || {};


student_grouping.pubSub = PubSub;

student_grouping.topBarComponent = new student_grouping.topBarControls();
student_grouping.filterComponent = new student_grouping.filters();
student_grouping.studentsListComponent = new student_grouping.studentsList();
student_grouping.groupsListComponent = new student_grouping.groupsList();

student_grouping.init = function(){
		
	var me = this;

	// set up the students list --> this goes before the groupsList 
	// because groupsList depends on the full list of students
	this.studentsListComponent.init();
	
	// set up the groups list
	this.groupsListComponent.init();
	
	// set up the top bar controls
	this.topBarComponent.init();	
	
	// set up the filter components
	student_grouping.filterComponent.init();	

	
	// set up the list controls	
	var listStudentData = _.pluck(this.students, 'studentData');
	
	// set up draggables and droppables
	$(".multidraggable").multidraggable(
	{	
		drag: function(event, ui){
			student_grouping.groupsListComponent.currGrp = null;
		},
		revert:"invalid",
		"helper":"clone", 
		"opacity":0.7 
	});
}

// initialize module
$(function() {
	student_grouping.init();
});
