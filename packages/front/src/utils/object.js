/*
  This is a greedy and fast deep comparition between two objects and have some restrictions.
  For a more generic comparition a formal version should be implemented.

  Restrictions:
    1. This function doesn't work when there are methods as attributes.
    2. The order of properties is important.
*/
export const isEquals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
