// MOCK DATA
var fakeStudents = [
{
	studentId: 's1',
	studentName: 'Michael Ng',
	gpa: 4,
	disabilities: ['Autistic'],
	classes: ['Algebra', 'English', 'Comp Sci']
},
{
	studentId: 's2',
	studentName: 'Mannhi Dao',
	gpa: 3,
	disabilities: ['Deafness', 'Emotional Disturbance'],
	classes: ['History', 'English']
},
{
	studentId: 's3',
	studentName: 'Al Rogers',
	gpa: 2.6,
	disabilities: ['Autistic'],
	classes: ['Algebra', 'English', 'Spanish']
},
{
	studentId: 's4',
	studentName: 'Matt Sollars',
	gpa: 3.1,
	disabilities: ['Autistic', 'Deafness'],
	classes: ['Algebra', 'English', 'French']
}];

var fakeGroups = [
{
	groupId: 'g1',
	groupName: 'The Green Team',
	color: '#DBFDAA',
	titleColor: '#7D9D38',
	description: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.'
},
{
	groupId: 'g2',
	groupName: 'Blue Man Group',
	color: '#A5C5FF',
	titleColor: '#2F62A0',
	description: 'This is the bacon ipsum group. Bunch of meat lovers that will refuse to eat any kind of vegetable, even if their life depended on it.'
}
];

var fakeAllGroups = [
{
	groupId: 'g1',
	groupName: 'The Green Team',
	color: '#DBFDAA',
	titleColor: '#7D9D38',
	description: 'This is the high achievers group. Kids in this group are kinda awesome, especially at Math and Science. They get A\'s all the time.'
},
{
	groupId: 'g2',
	groupName: 'Blue Man Group',
	color: '#A5C5FF',
	titleColor: '#2F62A0',
	description: 'This is the bacon ipsum group. Bunch of meat lovers that will refuse to eat any kind of vegetable, even if their life depended on it.'
},
{
	groupId: 'g3',
	groupName: 'The Purple Group',
	color: '#CBB7E9',
	titleColor: '#654788',
	description: 'Bacon ipsum dolor sit amet shoulder chicken meatloaf ham hock spare ribs capicola. Filet mignon meatloaf corned beef chicken t-bone ribeye ball tip bacon. Strip steak turkey jowl ball tip, drumstick meatloaf pig. Hamburger chicken pork belly sirloin tenderloin ball tip short loin salami. Ground round strip steak pork shoulder boudin drumstick jowl hamburger.'
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
