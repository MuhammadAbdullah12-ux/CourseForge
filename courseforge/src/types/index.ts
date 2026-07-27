// 1. Define the Course Interface to represent our course data structure.
// This matches the properties we will retrieve from our relational database tables next week.
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string; // Simplifies the instructor relation for our frontend mock views
  published: boolean;
  createdAt: string; // ISO date string representation
}
