import ratelimit from "../config/upstash.js";
//next() - is a call back fun provided by expresss to move to the next middleware or route handler

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later" });
    }
    next();
  } catch (error) {
    console.log("Rate limiter error", error);
    next(error);
  }
};

export default ratelimiter;
