var student_grouping = student_grouping || {};

student_grouping.studentsList = function(){
	var me = this;
	this.pubSub = PubSub;
	
	this.students = [];
	this.studentListElem = '#studentList';
	
	this.selectAllBtn = '#select-all-btn';
	this.randomBtn = '#random-btn';
	this.randomNumTxt = '#random-num-txt';
	this.studentSearchBox = '#txtStudentSearchBox';
		
	// keep track of whether user has selected all
	this.allSelected = false;
	
	/**************************
     * METHODS
     **************************/
	this.init = function(){		
					
		// temp code
		for (var i = 0; i < fakeStudents.length; i++){
			var fakeStudent = fakeStudents[i];
			
			var student = new student_grouping.student(fakeStudent);		
			$(this.studentListElem).append(student.generateTemplate());			
			student.init();	
			
			this.students.push(student);
		}
		
		// add event handler for filter student list using search box
		$(this.studentSearchBox).keyup(function(){
			var filterVal = $(this).val();					
			var filter = {
				attributeName: 'name',
				attributeId: 'name',
				operator: 'startsWith',
				value: filterVal,
				values: []
			}
			
			// notify filter component to add filter for 
			me.pubSub.publish('add-manual-filter', filter);	
		});		
		
		$(this.selectAllBtn).click(function(event){
			me.selectAllStudents();
		});	
					
		$(this.randomBtn).click(function(event){
			me.assignRandom();
		});
					
		// TODO add description
		this.pubSub.subscribe('filter-student-list', function(){
			me.filterStudentList();
		});
		
		this.pubSub.subscribe('student-selection-changed', function(studentId){
			// TODO add method
		});
				
	}	
	
	/**
	 * Repopulate the list of students with given list 
	 */
	this.changeSelectableList = function(listStudentData, changeEventHandler){
		var options = [];
		_.each(listStudentData, function(studentData){
			return options.push(
				{ id : studentData.id, text : studentData.name });
		});
		
		$(this.studentSearchBox).select2('destroy');
		$(this.studentSearchBox).select2(
			{ 
				data : options, 
				width : 'element'
			});
		$(this.studentSearchBox).on('change', changeEventHandler);
	}
	
	/**
	 * Filter list of students by name
	 */
	this.filterStudentsByName = function(listOfStudents){
		var filterVal = $(this.studentSearchBox).val();
		
		filteredList = _.filter(listOfStudents, function(student){
			
		});
		
		return filteredList;
	}
	
	/**
	 *  
	 */
	this.filterStudentList = function(){				
		// TODO refactor dependency on filter component
		var filteredStudents = student_grouping.filterComponent.applyFilters(this.students);
		_.each(this.students, function(studentLi){
			var filteredStudent = _.find(filteredStudents, function(s){
				return s.studentData.id === studentLi.studentData.id;
			});
			studentLi.toggleVisible(filteredStudent !== undefined);
		});
	}
	
	/**
	 * Select all students in the list 
	 */
	this.selectAllStudents = function(){		
		_.each(this.students, function(student){
			student.toggleStudentSelection(!me.allSelected);
		});
		
		// select/deselect the checkboxes
		$(".student-selBox").prop('checked', !me.allSelected);		
		
		this.allSelected = !this.allSelected;
		
		if (this.allSelected){
			$(this.selectAllBtn).html('deselect all');
		} else {
			$(this.selectAllBtn).html('select all');
		}
	}
	
	/**
	 * TODO add description and check for numeric value 
	 */
	this.assignRandom = function(){
		var me = this;
		var randomNum = $(this.randomNumTxt).val();
		if (randomNum !== ''){		
			this.pubSub.publish('assign-random', this.students, randomNum);
			$(this.randomNumTxt).val('');
		} else {
			$(this.randomNumTxt).tooltip('show');
			setTimeout(function(){
				$(me.randomNumTxt).tooltip('hide');
			}, 4000);
		}
	}
	
	/**
	 * Return the student object with the given id 
	 */
	this.getStudentById = function(studentId){
		var matchingStudent = _.find(this.students, function(student){
			return student.studentData.id === studentId;
		});
		return matchingStudent;
	}
}
