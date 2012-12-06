// MOCK DATA
var fakeStudents = [
{
	
	id: 's1',
	name: 'Michael Ng',
	gradeLevel: "Eighth grade",
	disabilities: ['Deafness','Mental Retardation'],	
	sections: ['s1','s2','s3'],
	cumulativeGradePointAverage: 4.2,
	learningStyles: {
		auditoryLearning: 52,
		tactileLearning: 31,
		visualLearning: 27
	}
},
{
	
	id: 's2',
	name: 'Mannhi Dao',
	gradeLevel: "Ninth grade",
	disabilities: ['Autistic','Deafness'],
	sections: ['s2','s3'],
	cumulativeGradePointAverage: 3.5,
	learningStyles: {
		auditoryLearning: 27,
		tactileLearning: 31,
		visualLearning: 52
	}
}
,{
	
	id: 's3',
	name: 'test Dao',
	gradeLevel: "Ninth grade",
	disabilities: ['Autistic','Deafness'],	
	sections: ['s3','s4'],
	cumulativeGradePointAverage: 3.5,
	learningStyles: {
		auditoryLearning: 31,
		tactileLearning: 27,
		visualLearning: 52
	}
},
{
	
	id: 's4',
	name: 'test2 Dao',
	gradeLevel: "Ninth grade",
	disabilities: ['Autistic','Emotional Disturbance'],	
	sections: ['s2','s4'],
	cumulativeGradePointAverage: 3.5,
	learningStyles: {
		auditoryLearning: 52,
		tactileLearning: 31,
		visualLearning: 27
	}
}
];

var fakeGroups = [
{
	id: 'g1',
	cohortIdentifier: 'The Green Team',
	cohortDescription: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.',
	color: '#DBFDAA',
	titleColor: '#7D9D38',	
	students: ['s2','s3']
},
{
	id: 'g2',
	cohortIdentifier: 'Blue Man Group',
	cohortDescription: 'This is the bacon ipsum group. Bunch of meat lovers that will refuse to eat any kind of vegetable, even if their life depended on it.',
	color: '#A5C5FF',
	titleColor: '#2F62A0',
	students:[]
}
];

var fakeAllGroups = [
{
	id: 'g1',
	cohortIdentifier: 'The Green Team',
	cohortDescription: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.',
	color: '#DBFDAA',
	titleColor: '#7D9D38',	
	students: ['s2','s3']
},
{
	id: 'g2',
	cohortIdentifier: 'Blue Man Group',
	cohortDescription: 'This is the bacon ipsum group. Bunch of meat lovers that will refuse to eat any kind of vegetable, even if their life depended on it.',
	color: '#A5C5FF',
	titleColor: '#2F62A0'
},
{
	id: 'g3',
	cohortIdentifier: 'The Purple Group',
	cohortDescription: 'Bacon ipsum dolor sit amet shoulder chicken meatloaf ham hock spare ribs capicola. Filet mignon meatloaf corned beef chicken t-bone ribeye ball tip bacon. Strip steak turkey jowl ball tip, drumstick meatloaf pig. Hamburger chicken pork belly sirloin tenderloin ball tip short loin salami. Ground round strip steak pork shoulder boudin drumstick jowl hamburger.',
	color: '#CBB7E9',
	titleColor: '#654788'
}
]

var fakeFilters = [
{
	attributeName: 'Disability',
	attributeId: 'disabilities',
	operators: ['equals','contains'],
	values: ['Autistic', 'Deafness', 'Emotional Disturbance', 'Small']
},
{
	attributeName: 'GPA',
	attributeId: 'gpa',
	operators: ['=', '>', '<', '>=', '<='],
	values: []
},
{
	attributeName: 'Section',
	attributeId: 'sections',
	operators: ['equals','contains'],
	values: [
		{ id:'s1', title: 'Section 1'},
		{ id:'s2', title: 'Section 2'},
		{ id:'s3', title: 'Section 3'},
		{ id:'s4', title: 'Section 4'},
	]
}
]

var fakeColors = [
{
	color: 'red',
	titleColor: 'black'
}
]
