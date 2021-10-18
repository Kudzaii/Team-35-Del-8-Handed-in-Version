export interface Task {
    Task_ID: number;
    Description: string;
    Feedback: string;
    StartDate?:any;
    DueDate:any;
    Status:any
    TaskType?: string;
    TaskStatus_ID?: number;
    TaskType_ID?: number;
    Trainee_ID?: number;
    Client_ID?:number;
    Practitioner_ID?: number;
    Trainer_ID?: number;

}


export interface Timeslot {
    TimeSlot_ID:number;
    TimeSlot1:any;
    StartTime:any;
    EndTime:any;
    isChosen?:boolean;
}