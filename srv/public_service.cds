using {db} from '../db/model';

service PublicService {

    type CurrentDowntime {
        ID          : UUID;
        title       : String(100);
        description : LargeString;
        type        : db.DowntimeType;
        system      : Association to one Systems;
        startsAt    : DateTime;
        endsAt      : DateTime;
        showFrom    : DateTime;
        showUntil   : DateTime;
        isDown      : Boolean default false;
    };


    @readonly
    entity Systems as projection on db.Systems actions {
        function getCurrentDowntimes() returns array of CurrentDowntime;
    }

}
