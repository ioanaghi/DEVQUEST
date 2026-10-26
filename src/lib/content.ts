import type { Mission } from '../types';
export const MISSIONS: Record<
  Mission,
  {
    title: string;
    ticket: string;
    language: string;
    file: string;
    intro: string;
    objective: string;
    hints: string[];
    lesson: string;
  }
> = {
  java: {
    title: 'The registration bug',
    ticket: '#001',
    language: 'Java',
    file: 'Registration.java',
    intro:
      'Our new signup form is turning away a few people who should be allowed in. Alex has narrowed it down to one comparison.',
    objective:
      'People aged 18 or older can register. Everyone younger than 18 cannot. Fix canRegister without changing its signature.',
    hints: [
      'Run the sample tests first. Which age behaves differently from the requirement?',
      'The words “18 or older” include the boundary itself. Try tracing what happens when age is exactly 18.',
      'Java has strict comparisons and inclusive comparisons. Which kind includes a value equal to the threshold?',
    ],
    lesson:
      'Boundary conditions are the values right on the edge of a rule. Test just below, exactly at, and just above that edge. A test turns an assumption into something you can check.',
  },
  filter: {
    title: 'The missing orders',
    ticket: '#104 · PART I',
    language: 'SQL',
    file: 'investigation.sql',
    intro:
      'Three customers say their orders vanished. The dashboard shows shipped orders only. The data might still be here.',
    objective:
      'Return exactly id and customer_id for every order whose status is pending. Do not change the data.',
    hints: [
      'Start by looking at orders. Which column describes the stage an order is in?',
      'SELECT controls the columns you return. WHERE filters which rows you keep.',
      'Text values go inside single quotes in SQL. Compare the status column to the status named in the ticket.',
    ],
    lesson:
      'SELECT chooses columns. FROM chooses a table. WHERE keeps rows that match a condition. A dashboard is only a view of the data: missing from a screen does not mean missing from the database.',
  },
  join: {
    title: 'Connect the dots',
    ticket: '#104 · PART II',
    language: 'SQL',
    file: 'customer_report.sql',
    intro:
      'You found the orders. Now support needs to know who to contact. Customer names live in a different table.',
    objective:
      'Return exactly id (the order ID) and customer_name for all pending orders. Connect orders.customer_id to customers.id. Use AS customer_name to name the customer column.',
    hints: [
      'Look at the schema. orders.customer_id refers to the id of a row in customers.',
      'JOIN combines matching rows. Its ON condition says which columns identify the same customer.',
      'Use aliases such as o and c to avoid ambiguous id columns. Keep the pending filter and give the customer name its requested column alias.',
    ],
    lesson:
      'A JOIN connects related tables using a key. Each pending order points to one customer. Keep the filter on the orders table, then select the order ID and the matching customer’s name.',
  },
};
export const CHAPTERS = [
  ['00', 'Your first day', 'Debugging · SQL detective'],
  ['01', 'Developer foundations', 'Logic · Terminal · Git'],
  ['02', 'Java fundamentals', 'Methods · Arrays · Strings'],
  ['03', 'Object-oriented thinking', 'Classes · Interfaces · SOLID'],
  ['04', 'SQL & databases', 'Queries · Transactions · Indexes'],
  ['05', 'Data structures', 'Lists · Trees · Graphs'],
  ['06', 'Algorithm arena', 'Patterns · Search · Sorting'],
  ['07', 'Backend engineering', 'HTTP · REST · Spring Boot'],
  ['08', 'Professional engineering', 'Testing · CI/CD · Security'],
  ['09', 'System design', 'Caching · Queues · Tradeoffs'],
  ['10', 'Interview tower', 'Coding · Design · Communication'],
];
