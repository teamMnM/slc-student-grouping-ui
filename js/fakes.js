// MOCK DATA
var fakeStudents = [
{
	
	id: 's1',
	name: 'Michael Ng',
	gradeLevel: "Eighth grade",
	disabilities: ['Deafness','Mental Retardation'],	
	sections: [
	{		
			courseTitle: 'Math 1',
			courseDescription: 'Mathematics stuff',
			subjectArea: 'Mathematics',
			courseLevel: 'Honors'
		}
	],
	cumulativeGradePointAverage: 4.2
},
{
	
	id: 's2',
	name: 'Mannhi Dao',
	gradeLevel: "Ninth grade",
	disabilities: ['Autistic','Deafness'],	
	sections: [
	{		
			courseTitle: 'Math 1',
			courseDescription: 'Mathematics stuff',
			subjectArea: 'Mathematics',
			courseLevel: 'Regular'
		}
	],
	cumulativeGradePointAverage: 3.5
}
];

var fakeGroups = [
{
	id: 'g1',
	cohortIdentifier: 'The Green Team',
	cohortDescription: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.',
	color: '#DBFDAA',
	titleColor: '#7D9D38',	
},
{
	id: 'g2',
	cohortIdentifier: 'Blue Man Group',
	cohortDescription: 'This is the bacon ipsum group. Bunch of meat lovers that will refuse to eat any kind of vegetable, even if their life depended on it.',
	color: '#A5C5FF',
	titleColor: '#2F62A0'
}
];

var fakeAllGroups = [
{
	id: 'g1',
	cohortIdentifier: 'The Green Team',
	cohortDescription: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.',
	color: '#DBFDAA',
	titleColor: '#7D9D38',	
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
	operators: ['contains'],
	values: ['Autistic', 'Deafness', 'Emotional Disturbance', 'Small']
},
{
	attributeName: 'GPA',
	attributeId: 'gpa',
	operators: ['=', '>', '<', '>=', '<='],
	values: []
}
]

var fakeColors = [
{
	color: 'red',
	titleColor: 'black'
}
]
