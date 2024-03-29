import { Candidate } from './candidate';
export interface Course{
    courseCode: string; //course code that identifies this course
    //courseName: string;
    //lecHours: number;
    //labOrTutHours: number; 
    //sections: number

    //assume that at any given instance, there are enough hours allocated to this course for the TAs assigned to it
    taHours: number; //number of hours allocated to this course
    assignList: Candidate[];//list of TAs that have been assigned to this course
}