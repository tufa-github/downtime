const cds = require("@sap/cds");

class PublicService extends cds.ApplicationService {
  async init() {
    this.on("getCurrentDowntimes", async (req) => {
      const [systemId] = req.params;

      const currentDate = new Date().toISOString();

      //console.log(req.data);
      console.log(systemId);
      console.log(currentDate);

      const downtimes = await SELECT.from`db.Downtimes`
        .where`showFrom <= ${currentDate} AND showUntil >= ${currentDate} AND system_ID = ${systemId}`;

      for (const downtime of downtimes) {
        downtime.isDown =
          downtime.startsAt <= currentDate && downtime.endsAt >= currentDate;
      }

      req.reply(downtimes);
    });

    await super.init();
  }
}

module.exports = PublicService;
