export interface Candidate{

    id:string; //could be student number or email or whatnot
    name:string;
    priority: number; //1 for fundable, 2 for unfundable, 3 for external
    taHours: number; //number of hours allocated to this TA, if they are assigned to a course

    //array of course code strings
    //contains all the courses that this candidate applied for
    //elements are ordered based on the candidate's preferences
    ranked_courses: string[]; 

}