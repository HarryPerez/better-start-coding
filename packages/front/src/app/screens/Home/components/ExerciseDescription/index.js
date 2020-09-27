import React from 'react';
import { string } from 'prop-types';

function ExerciseDescription({ className, description, exercise }) {
  return (
    <div className={`column ${className}`}>
      <span className="regular title-medium text-tundora">{description}</span>
      <span className="regular title-medium text-tundora">{exercise}</span>
    </div>
  );
}

ExerciseDescription.propTypes = {
  className: string,
  description: string,
  exercise: string
};

export default ExerciseDescription;
