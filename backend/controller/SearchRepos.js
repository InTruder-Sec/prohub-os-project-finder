import User from "../model/user.js";
import repos from "./../model/repos.js";

const SearchRepos = (req, res) => {
  const data = req.query;
  let latest = -1;
  if (data.latest !== "true") {
    latest = 1;
  }
  if (data.location === "true") {
    try {
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: "token " + data.token,
        },
      })
        .then((result) => result.json())
        .then((result) => {
          // Check if user exsist in database
          User.findOne({ name: result.login })
            .then((user) => {
              const location = user.city + ", " + user.country;
              let keywords = data.q.split(" ");
              keywords = keywords.map((keyword) => {
                return keyword.toUpperCase();
              });
              repos
                .find({
                  $or: [
                    { repoName: { $regex: data.q, $options: "i" } },
                    { repoTags: { $in: keywords } },
                    { reposDescription: { $regex: data.q, $options: "i" } },
                  ],
                  repoLocation: location,
                })
                .sort({ repoDate: latest })
                .then((result) => {
                  console.log(result);
                  res.status(200).json({
                    code: 200,
                    message: "OK",
                    data: result,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res
                    .status(500)
                    .json({ message: "Internal Server Error", data: [] });
                });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(500)
                .json({ message: "Internal Server Error", data: [] });
            });
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    const keywords = data.q.split(" ");
    repos
      .find({
        $or: [
          { repoName: { $regex: data.q, $options: "i" } },
          { skills: { $in: keywords } },
          { reposDescription: { $regex: data.q, $options: "i" } },
        ],
      })
      .then((result) => {
        res.status(200).json({
          code: 200,
          message: "OK",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", data: [] });
      });
  }
};

const LatestRepo = (req, res) => {
  repos
    .find({})
    .sort({ repoDate: -1 })
    .limit(30)
    .then((result) => {
      res.status(200).json({
        code: 200,
        message: "OK",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

export { LatestRepo, SearchRepos };
