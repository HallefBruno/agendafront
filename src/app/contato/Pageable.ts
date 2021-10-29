import { Contato } from "./Contato";

export class Pageable {
  content: Contato[]=[];
  totalElements:number;
  totalPages:number;
  size:number;
  number:number;
}
