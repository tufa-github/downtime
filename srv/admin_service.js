const cds = require("@sap/cds");

const { Configuration, OpenAIApi } = require("openai");

class AdminService extends cds.ApplicationService {
  async init() {
    const { Downtimes } = this.entities;

    this.before("CREATE", Downtimes, async (req) => {
      const downtime = req.data;

      downtime.schedule = await this.createCron(downtime.scheduleDescription);
    });

    await super.init();
  }

  async createCron(cronText) {
    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: "No explanation, just return the cron value.",
        },

        { role: "user", content: `What is the cron value for: ${cronText}` },
      ],
    });

    return completion.data.choices[0].message.content;
  }
}

module.exports = AdminService;
