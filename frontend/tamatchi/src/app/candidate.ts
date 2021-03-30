export interface Candidate{

    course: string[]; 
    email:string; //student email. will serve as id
    hrs: number; //number of hours allocated to this TA, if they are assigned to a course
    name:string;
    questions:any;
    ranks:number[];
    status: number; //1 for fundable, 2 for unfundable, 3 for external


    

}