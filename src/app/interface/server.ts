// import { Status } from "../enum/Status.enum";
import { Status } from "../enum/Status.enum";

export interface Server{
id:number;
ipAddress:string;
name:string;
memory:string;
type:string;
imageurl:string;
status:Status;

}
