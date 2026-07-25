import { Card } from './Card';

// 1. Define the TypeScript Interface for our Course data structure
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
}

// 2. Define our static mock courses array
const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React: Components, Props, JSX, and State.',
    instructor: 'Jane Doe'
  },
  {
    id: 'course-2',
    title: 'Next.js App Router',
    description: 'Master routing, layouts, server components, and client components in Next.js 15.',
    instructor: 'John Smith'
  },
  {
    id: 'course-3',
    title: 'TypeScript Crash Course',
    description: 'Understand how typing helps prevent bugs in full-stack JS projects.',
    instructor: 'Alice Johnson'
  }
];

// 3. Define the CourseList component which maps the array into Cards
export function CourseList() {
  return (
    <div style={{ margin: '24px 0', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ color: '#f8fafc', borderBottom: '2px solid #334155', paddingBottom: '8px', textAlign: 'left' }}>
        Dynamic Course Catalog
      </h2>

      {/* 4. We use .map() to loop through the array and render a Card component for each course */}
      {MOCK_COURSES.map((course) => {
        return (
          <Card 
            key={course.id} // CRITICAL: This is the key prop that helps React track DOM nodes efficiently
            title={course.title}
          >
            <p style={{ margin: '0 0 8px 0' }}>{course.description}</p>
            <small style={{ color: '#94a3b8', fontStyle: 'italic' }}>
              Instructor: {course.instructor}
            </small>
          </Card>
        );
      })}
    </div>
  );
}
