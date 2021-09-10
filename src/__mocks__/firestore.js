export default {
  bills() {
    return {
      get() {
        return Promise.resolve({
          docs: [
            {
              data() {
                return {
                  id: "47qAXb6fIm2zOKkLzMro",
                  vat: "80",
                  fileUrl:
                    "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                  status: "pending",
                  type: "Hôtel et logement",
                  commentary: "séminaire billed",
                  name: "Mocked bill",
                  fileName: "preview-facture-free-201801-pdf-1.jpg",
                  date: "2004-04-04",
                  amount: 4000,
                  commentAdmin: "ok",
                  email: "a@a",
                  pct: 20,
                };
              },
            },
          ],
        });
      },
    };
  },
};
