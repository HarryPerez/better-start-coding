export const FUNDAMENTALS_TOPICS = {
  VARIABLES: 'variables',
  FUNCTIONS: 'functions',
  STATEMENS: 'statements',
  LISTS: 'lists',
  LOOPS: 'loops',
  SETS: 'sets'
};

export const FUNDAMENTALS_TOPICS_EXERCISES = {
  [FUNDAMENTALS_TOPICS.VARIABLES]: {
    title: 'Variables',
    description:
      'Variables are the names you give to computer memory locations which are used to store values in a computer program. Create variables with appropriate names. Store your values in those two variables.',
    exercise: 'Declare X and Y variables and make an addition saving the result inside a var called SUM.',
    conditions: {
      required: ['x', 'y', 'sum']
    }
  }
};

export const INITIAL_TOPIC = FUNDAMENTALS_TOPICS.VARIABLES;
