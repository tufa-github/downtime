using {
    cuid,
    managed
} from '@sap/cds/common';

namespace db;

type DowntimeType  : String(100) enum {
    Onetime;
    Recurring
};

entity Downtimes : cuid, managed {
    title       : String(100);
    description : LargeString;
    type        : DowntimeType;
    system      : Association to one Systems;
    startsAt    : DateTime;
    endsAt      : DateTime;
    showFrom    : DateTime;
    showUntil   : DateTime;
//regularTime            : String(10);
//regularTimeDescription : String(100);

}

/*entity RecurringTemplates : cuid, managed {

    startAt       : DateTime;
    recurringType : RecurringType;
    downtimes     : Association to many Downtimes
                        on downtimes.recurring = $self;
}
*/

entity Systems : cuid, managed {
    title       : String(100);
    description : String(1000);
    Downtimes   : Association to many Downtimes
                      on Downtimes.system = $self;
}
