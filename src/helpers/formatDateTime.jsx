 
import { format } from 'date-fns';

export function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');  
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  return format(date, 'hh:mm a');  
}
