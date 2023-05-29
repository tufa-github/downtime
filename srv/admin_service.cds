using{ db} from '../db/model';

service AdminService {

  entity Downtimes as projection on db.Downtimes;

  entity Systems as projection on db.Systems;

}