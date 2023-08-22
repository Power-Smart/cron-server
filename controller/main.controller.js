
export const mainController = (req, res) => {
    console.log("Event: main event (/get) ");
    res.sendStatus(200);
};

export const mainControllerPost = (req, res) => {
    res.sendStatus(200);
};
