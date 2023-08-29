import { Timestamp } from 'firebase/firestore';

// Function to check if a date is valid (not in the future)
export const isValidDate = (date) => {
    const currentDate = new Date();
    return new Date(date) <= currentDate;
  };
  
  // Function to check if the end date is valid (not before start date)
  export const isEndDateValid = (startDate, endDate) => {
    return new Date(startDate) <= new Date(endDate);
  };
  
  // Function to create a Timestamp instance from a Date object
  export const createTimestamp = (date) => {
    return Timestamp.fromDate(date);
  };
// Add an optional array of columns that need numeric conversion
export const sortArray = (array, column, order, numericColumns = []) => {
    return array.slice().sort((a, b) => {
      if (!column) {
        return 0;
      }
  
      const valueA = a[column];
      const valueB = b[column];
  
      // Convert numeric columns to numbers before comparison
      const convertedValueA = numericColumns.includes(column) ? parseFloat(valueA) : valueA;
      const convertedValueB = numericColumns.includes(column) ? parseFloat(valueB) : valueB;
  
      if (convertedValueA instanceof Date && convertedValueB instanceof Date) {
        // If values are dates, compare them directly
        return order === 'asc' ? convertedValueA - convertedValueB : convertedValueB - convertedValueA;
      } else if (typeof convertedValueA === 'string' && typeof convertedValueB === 'string') {
        const comparison = convertedValueA.localeCompare(convertedValueB);
        return order === 'asc' ? comparison : -comparison;
      } else {
        // Fallback comparison using default behavior for non-date, non-string values
        if (convertedValueA < convertedValueB) return order === 'asc' ? -1 : 1;
        if (convertedValueA > convertedValueB) return order === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };
  